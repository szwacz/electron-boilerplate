'use strict';

var app = require('app');
var ipc = require('ipc');
var path = require('path');
var BrowserWindow = require('browser-window');
var env = require('./vendor/electron_boilerplate/env_config');
var devHelper = require('./vendor/electron_boilerplate/dev_helper');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');

// global variable
var APP_NAME = 'Rocket.Chat';
var INDEX = 'https://rocket.chat/home';
// var INDEX = 'file://' + path.join( __dirname, 'app.html' );

// Create main window
var mainWindow;

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 1000,
    height: 600
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', appReady);

function appReady() {

    mainWindow = new BrowserWindow({
        title: APP_NAME,
        "node-integration": false,
        'accept-first-mouse': true,
        show: false,
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height
    });

    if (mainWindowState.isMaximized) {
        mainWindow.maximize();
    }

    mainWindow.loadUrl(INDEX);

    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.show();
    });

    mainWindow.webContents.gabriel = 'TEST';
    console.log(mainWindow.webContents);
    console.log(ipc);

    if (env.name === 'development') {
        devHelper.setDevMenu();
        mainWindow.openDevTools();
    }

    mainWindow.on('close', function() {
        mainWindowState.saveState(mainWindow);
    });

};

// Custom function
ipc.on('message', function(event, arg) {
    console.log(arg); // prints "ping"
    event.returnValue = 'pong';
});

ipc.on('open-dev', function(event, arg) {
    mainWindow.openDevTools();
});
