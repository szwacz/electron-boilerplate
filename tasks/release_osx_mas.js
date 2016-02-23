'use strict';

var Q = require('q');
var gulpUtil = require('gulp-util');
var jetpack = require('fs-jetpack');
var asar = require('asar');
var utils = require('./utils');
var child_process = require('child_process');

var projectDir;
var releasesDir;
var tmpDir;
var finalAppDir;
var manifest;

var init = function () {
    projectDir = jetpack;
    tmpDir = projectDir.dir('./tmp', { empty: true });
    releasesDir = projectDir.dir('./releases');
    manifest = projectDir.read('app/package.json', 'json');
    finalAppDir = tmpDir.cwd(manifest.productName + '.app');

    return new Q();
};

var copyRuntime = function () {
    return projectDir.copyAsync('node_modules/electron-prebuilt/dist/Electron.app', finalAppDir.path());
};

var cleanupRuntime = function () {
    finalAppDir.remove('Contents/Resources/default_app');
    finalAppDir.remove('Contents/Resources/atom.icns');
    return new Q();
};

var packageBuiltApp = function () {
    var deferred = Q.defer();

    asar.createPackage(projectDir.path('build'), finalAppDir.path('Contents/Resources/app.asar'), function () {
        deferred.resolve();
    });

    return deferred.promise;
};

var finalize = function () {
    // Prepare main Info.plist
    var info = projectDir.read('resources/osx/Info.plist');
    info = utils.replace(info, {
        productName: manifest.productName,
        identifier: manifest.identifier,
        version: manifest.version,
        build: manifest.build,
        copyright: manifest.copyright
    });

    finalAppDir.write('Contents/Info.plist', info);

    // Prepare Info.plist of Helper apps
    [' EH', ' NP', ''].forEach(function (helper_suffix) {
        info = projectDir.read('resources/osx/helper_apps/Info' + helper_suffix + '.plist');
        info = utils.replace(info, {
            productName: manifest.productName,
            identifier: manifest.identifier
        });
        finalAppDir.write('Contents/Frameworks/Electron Helper' + helper_suffix + '.app/Contents/Info.plist', info);
    });

    // Copy icon
    projectDir.copy('app/images/osx/icon.icns', finalAppDir.path('Contents/Resources/icon.icns'));

    return new Q();
};

var renameApp = function () {
    // Rename helpers
    [' Helper EH', ' Helper NP', ' Helper'].forEach(function (helper_suffix) {
        finalAppDir.rename('Contents/Frameworks/Electron' + helper_suffix + '.app/Contents/MacOS/Electron' + helper_suffix, manifest.productName + helper_suffix );
        finalAppDir.rename('Contents/Frameworks/Electron' + helper_suffix + '.app', manifest.productName + helper_suffix + '.app');
    });
    // Rename application
    finalAppDir.rename('Contents/MacOS/Electron', manifest.productName);
    return new Q();
};

var signApp = function () {
    var identity = utils.getSigningId();
    var installerIdentity = utils.getInstallerSigningId();
    if (identity && installerIdentity) {
        var cmds = [
            'codesign --deep -f -s "' + identity + '" --entitlements child.plist -v "' + finalAppDir.path() + '/Contents/Frameworks/Electron Framework.framework/Versions/A"',
            'codesign --deep -f -s "' + identity + '" --entitlements child.plist -v "' + finalAppDir.path() + '/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib"',
            'codesign --deep -f -s "' + identity + '" --entitlements child.plist -v "' + finalAppDir.path() + '/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libnode.dylib"',
            'codesign --deep -f -s "' + identity + '" --entitlements child.plist -v "' + finalAppDir.path() + '/Contents/Frameworks/' + manifest.productName + ' Helper.app/"',
            'codesign --deep -f -s "' + identity + '" --entitlements child.plist -v "' + finalAppDir.path() + '/Contents/Frameworks/' + manifest.productName + ' Helper EH.app/"',
            'codesign --deep -f -s "' + identity + '" --entitlements child.plist -v "' + finalAppDir.path() + '/Contents/Frameworks/' + manifest.productName + ' Helper NP.app/"'
        ];

        if (finalAppDir.exists('Contents/Frameworks/Squirrel.framework/Versions/A')) {
            // # Signing a non-MAS build.
            cmds.push('codesign --deep -fs "' + identity + '" --entitlements child.plist "' + finalAppDir.path() + '/Contents/Frameworks/Mantle.framework/Versions/A"');
            cmds.push('codesign --deep -fs "' + identity + '" --entitlements child.plist "' + finalAppDir.path() + '/Contents/Frameworks/ReactiveCocoa.framework/Versions/A"');
            cmds.push('codesign --deep -fs "' + identity + '" --entitlements child.plist "' + finalAppDir.path() + '/Contents/Frameworks/Squirrel.framework/Versions/A"');
        }

        cmds.push('codesign --deep -f -s "' + identity + '" --entitlements parent.plist -v "' + finalAppDir.path() + '"');

        cmds.push('productbuild --component "' + finalAppDir.path() + '" /Applications --sign "' + installerIdentity + '" "' + releasesDir.path(manifest.productName + '.pkg') + '"');

        var result = new Q();
        cmds.forEach(function (cmd) {
            result = result.then(function(result) {
                console.log(result);
                gulpUtil.log('Signing with:', cmd);
                return Q.nfcall(child_process.exec, cmd);
            });
        });
        result = result.then(function(result) {
            console.log(result);
            return new Q();
        });
        return result;
    } else {
        return new Q();
    }
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
    .then(signApp)
    .then(cleanClutter)
    .catch(console.error);
};
