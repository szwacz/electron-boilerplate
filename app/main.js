'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var env = require('./vendor/electron_boilerplate/env_config');
var devHelper = require('./vendor/electron_boilerplate/dev_helper');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');

var mainWindow;

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 1000,
    height: 600
});

app.on('ready', function() {

    mainWindow = new BrowserWindow({
        "node-integration": false,
        'accept-first-mouse': true,
        title: 'Rocket.Chat',
        show: false,
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height
    });

    if (mainWindowState.isMaximized) {
        mainWindow.maximize();
    }

    // mainWindow.loadUrl('file://' + __dirname + '/app.html');
    mainWindow.loadUrl('https://rocket.chat/home');

    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.show();
    });


    if (env.name === 'development') {
        devHelper.setDevMenu();
        mainWindow.openDevTools();
    }

    mainWindow.on('close', function() {
        mainWindowState.saveState(mainWindow);
    });
});

app.on('window-all-closed', function() {
    app.quit();
});
