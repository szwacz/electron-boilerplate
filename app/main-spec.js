'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('ready', function () {

    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadUrl('file://' + __dirname + '/spec.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});

app.on('window-all-closed', function () {
    app.quit();
});
