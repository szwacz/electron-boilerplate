'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var jetpack = require('fs-jetpack');

// Must keep references to opened windows,
// otherwise Garbage Collector will kick in.
var mainWindow = null;

// Atom-shell is ready, we can start with our stuff.
app.on('ready', function () {

    var appCodeDir = jetpack.cwd(__dirname);
    var manifest = appCodeDir.read('package.json', 'json');

    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
