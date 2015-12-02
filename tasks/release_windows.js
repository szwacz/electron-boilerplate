'use strict';

var Q = require('q');
var gulpUtil = require('gulp-util');
var childProcess = require('child_process');
var jetpack = require('fs-jetpack');
var asar = require('asar');
var utils = require('./utils');
var uuid = require('node-uuid');

var projectDir;
var tmpDir;
var releasesDir;
var readyAppDir;
var manifest;

var init = function () {
    projectDir = jetpack;
    tmpDir = projectDir.dir('./tmp', { empty: true });
    releasesDir = projectDir.dir('./releases');
    manifest = projectDir.read('app/package.json', 'json');
    readyAppDir = tmpDir.cwd(manifest.name);

    return Q();
};

var copyRuntime = function () {
    return projectDir.copyAsync('node_modules/electron-prebuilt/dist', readyAppDir.path(), { overwrite: true });
};

var cleanupRuntime = function () {
    return readyAppDir.removeAsync('resources/default_app');
};

var packageBuiltApp = function () {
    var deferred = Q.defer();

    asar.createPackage(projectDir.path('build'), readyAppDir.path('resources/app.asar'), function() {
        deferred.resolve();
    });

    return deferred.promise;
};

var finalize = function () {
    var deferred = Q.defer();

    projectDir.copy('resources/windows/icon.ico', readyAppDir.path('icon.ico'));

    // Replace Electron icon for your own.
    var rcedit = require('rcedit');
    rcedit(readyAppDir.path('electron.exe'), {
        'icon': projectDir.path('resources/windows/icon.ico'),
        'version-string': {
            'ProductName': manifest.productName,
            'FileDescription': manifest.description,
        }
    }, function (err) {
        if (!err) {
            deferred.resolve();
        }
    });

    return deferred.promise;
};

var renameApp = function () {
    return readyAppDir.renameAsync('electron.exe', manifest.productName + '.exe');
};

var createInstaller = function (){
    return utils.useWix() ? createWixInstaller() : createNsisInstaller();
};

var createNsisInstaller = function () {
    var deferred = Q.defer();

    var finalPackageName = manifest.name + '_' + manifest.version + '.exe';
    var installScript = projectDir.read('resources/windows/installer.nsi');
    installScript = utils.replace(installScript, {
        name: manifest.name,
        productName: manifest.productName,
        version: manifest.version,
        src: readyAppDir.path(),
        dest: releasesDir.path(finalPackageName),
        icon: readyAppDir.path('icon.ico'),
        setupIcon: projectDir.path('resources/windows/setup-icon.ico'),
        banner: projectDir.path('resources/windows/setup-banner.bmp'),
    });
    tmpDir.write('installer.nsi', installScript);

    gulpUtil.log('Building installer with NSIS...');

    // Remove destination file if already exists.
    releasesDir.remove(finalPackageName);

    // Note: NSIS have to be added to PATH (environment variables).
    var nsis = childProcess.spawn('makensis', [
        tmpDir.path('installer.nsi')
    ], {
        stdio: 'inherit'
    });
    nsis.on('error', function (err) {
        if (err.message === 'spawn makensis ENOENT') {
            throw "Can't find NSIS. Are you sure you've installed it and"
                + " added to PATH environment variable?";
        } else {
            throw err;
        }
    });
    nsis.on('close', function () {
        gulpUtil.log('Installer ready!', releasesDir.path(finalPackageName));
        deferred.resolve();
    });

    return deferred.promise;
};

var createWixInstaller = function () {
    return generateListOfFiles()
        .then(runCandleForMsi)
        .then(runLightForMsi)
        .then(runCandleForBootstraper)
        .then(runLightForBootstraper);
};

var generateListOfFiles = function () {
    var deferred = Q.defer();

    gulpUtil.log('Building installer with WIX...');

    gulpUtil.log('Running HEAT to generate a files list for feature...');

    // Note: WIX DIR have to be added to PATH (environment variables).
    var heat = childProcess.spawn('heat', [
        'dir',
        readyAppDir.path(),
        '-cg',
        'ApplicationFiles',
        '-dr',
        'INSTALLDIR',
        '-v',
        '-sw5150',
        '-gg',
        '-g1',
        '-sreg',
        '-sfrag',
        '-srd',
        '-out',
        tmpDir.path('files.wxl')
    ], {
        stdio: 'inherit'
    });
    heat.on('error', function (err) {
        if (err.message === 'spawn heat ENOENT') {
            throw "Can't find HEAT. Are you sure you've installed WIX and"
            + " added to PATH environment variable?";
        } else {
            throw err;
        }
    });
    heat.on('close', function () {
        gulpUtil.log('File generated!');
        deferred.resolve();
    });

    return deferred.promise;
};

var runCandleForMsi = function () {
    var deferred = Q.defer();

    gulpUtil.log('Converting LICENSE file to rtf...');

    var license = readyAppDir.read('LICENSE');

    license = utils.convertToRtf (license);

    tmpDir.write('LICENSE.rtf', license);

    var fragment = projectDir.read('tmp/files.wxl');

    fragment = fragment.replace(new RegExp('SourceDir', 'g'), readyAppDir.path());

    projectDir.write('tmp/files.wxl', fragment);

    var wixFile = projectDir.read('resources/windows/installer.wxl');

    wixFile = utils.replace(wixFile, {
        name: manifest.name,
        productName: manifest.productName,
        version: manifest.version,
        icon: readyAppDir.path('icon.ico'),
        banner: projectDir.path('resources/windows/setup-banner.bmp'),
        license: tmpDir.path('LICENSE.rtf'),
        productId: uuid.v4(),
        upgradeCode: uuid.v4(),
        manufacturer : manifest.name
    });

    tmpDir.write('installer.wxl', wixFile);

    gulpUtil.log('Running CANDLE to compile a wix objects for MSI...');

    // Note: WIX DIR have to be added to PATH (environment variables).
    var candle = childProcess.spawn('candle', [
        tmpDir.path('installer.wxl'),
        tmpDir.path('files.wxl'),
        '-out',
        tmpDir.path() + '\\'
    ], {
        stdio: 'inherit'
    });

    candle.on('error', function (err) {
        if (err.message === 'spawn candle ENOENT') {
            throw "Can't find CANDLE. Are you sure you've installed WIX and"
            + " added to PATH environment variable?";
        } else {
            throw err;
        }
    });

    candle.on('close', function () {
        gulpUtil.log('Wix object compiled!');
        deferred.resolve();
    });

    return deferred.promise;
};

var runLightForMsi = function () {
    var deferred = Q.defer();

    var finalPackageName = manifest.name + '_' + manifest.version + '.msi';

       gulpUtil.log('Running Light to create an MSI installer...');

    // Note: WIX DIR have to be added to PATH (environment variables).
    var light = childProcess.spawn('light', [
        '-out',
        releasesDir.path(finalPackageName),
        '-ext',
        'WixUIExtension.dll',
        '-sw1076',
        tmpDir.path('installer.wixobj'),
        tmpDir.path('files.wixobj')

    ], {
        stdio: 'inherit'
    });

    light.on('error', function (err) {
        if (err.message === 'spawn candle ENOENT') {
            throw "Can't find LIGHT. Are you sure you've installed WIX and"
            + " added to PATH environment variable?";
        } else {
            throw err;
        }
    });
    light.on('close', function () {
        gulpUtil.log('Wix object compiled!');
        deferred.resolve();
    });

    return deferred.promise;
};

var runCandleForBootstraper = function () {
    var deferred = Q.defer();

    var wixFile = projectDir.read('resources/windows/bootstraper.wxl');

    wixFile = utils.replace(wixFile, {
        name: manifest.name,
        productName: manifest.productName,
        version: manifest.version,
        icon: readyAppDir.path('icon.ico'),
        banner: projectDir.path('resources/windows/setup-banner.bmp'),
        license: tmpDir.path('LICENSE.rtf'),
        upgradeCode: uuid.v4(),
        manufacturer : manifest.name,
        msi : releasesDir.path(manifest.name + '_' + manifest.version + '.msi')
    });

    tmpDir.write('bootstraper.wxl', wixFile);

    gulpUtil.log('Running CANDLE to compile a wix objects for bootstraper...');

    // Note: WIX DIR have to be added to PATH (environment variables).
    var candle = childProcess.spawn('candle', [
        tmpDir.path('bootstraper.wxl'),
        '-ext',
        'WixBalExtension.dll',
        '-out',
        tmpDir.path() + '\\'
    ], {
        stdio: 'inherit'
    });

    candle.on('error', function (err) {
        if (err.message === 'spawn candle ENOENT') {
            throw "Can't find CANDLE. Are you sure you've installed WIX and"
            + " added to PATH environment variable?";
        } else {
            throw err;
        }
    });

    candle.on('close', function () {
        gulpUtil.log('Wix object compiled!');
        deferred.resolve();
    });

    return deferred.promise;
};

var runLightForBootstraper  = function () {
    var deferred = Q.defer();

    var finalPackageName = manifest.name + '_' + manifest.version + '.exe';

    gulpUtil.log('Running Light to create an bootstraper installer...');

    // Note: WIX DIR have to be added to PATH (environment variables).
    var light = childProcess.spawn('light', [
        '-out',
        releasesDir.path(finalPackageName),
        '-ext',
        'WixBalExtension.dll',
        tmpDir.path('bootstraper.wixobj')
    ], {
        stdio: 'inherit'
    });

    light.on('error', function (err) {
        if (err.message === 'spawn candle ENOENT') {
            throw "Can't find LIGHT. Are you sure you've installed WIX and"
            + " added to PATH environment variable?";
        } else {
            throw err;
        }
    });
    light.on('close', function () {
        gulpUtil.log('Wix object compiled!');
        deferred.resolve();
    });

    return deferred.promise;
};

var cleanClutter = function () {
    return tmpDir.removeAsync('.');
};

module.exports = function () {
    return init()
    .then(copyRuntime)
    .then(cleanupRuntime)
    .then(packageBuiltApp)
    .then(finalize)
    .then(renameApp)
    .then(createInstaller)
    .then(cleanClutter)
    .catch(console.error);
};
