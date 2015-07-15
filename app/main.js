'use strict';

var app = require('app');
var ipc = require('ipc');
var path = require('path');
var BrowserWindow = require('browser-window');
var env = require('./vendor/electron_boilerplate/env_config');
var devHelper = require('./vendor/electron_boilerplate/dev_helper');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');
var tray = require('./tray');

// global variable
var APP_NAME = 'Rocket.Chat';
var INDEX = 'https://rocket.chat/home';
// var INDEX = 'file://' + path.join( __dirname, 'app.html' );

let flagQuitApp = false;
let mainWindow;

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 1000,
    height: 600
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    tray.destroy();
    if (process.platform !== 'darwin') {
        quit();
    }
});

app.on('activate-with-no-open-windows', function() {
    if (!mainWindow) {
        appReady();
    } else {
        mainWindow.show();
    }
});

var willQuit = false;

app.on('before-quit', function() {
    willQuit = true;
});

app.on('ready', appReady);

function initWindow() {
    var win = new BrowserWindow({
        'title': APP_NAME,
        // Standard icon looks somehow very thin in the taskbar
        'icon': path.resolve(path.join(__dirname, 'icons', 'tray', 'icon-tray.png')),
        'node-integration': false,
        'accept-first-mouse': true,
        'show': false,
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
        'preload': path.resolve(path.join(__dirname, 'preload.js')),
        'web-preferences': {
            'web-security': false
        }
    });

    if (mainWindowState.isMaximized) {
        win.maximize();
    }

    if (env.name === 'development') {
        devHelper.setDevMenu();
        win.openDevTools();
    }

    return win;
}

function appReady() {
    let appWindow;

    appWindow = initWindow();
    appWindow.hide();
    appWindow.webContents.on('did-finish-load', function() {
        //prevent flicker workaround
        mainWindow.setAlwaysOnTop(true);
        appWindow.show();
        setTimeout(function() {
            mainWindow.close();
        }, 100);
    });

    mainWindow = initWindow();
    mainWindow.loadUrl(INDEX);

    tray.createAppTray(mainWindow);
    tray.bindOnQuit(onQuitApp);

    appWindow.on('close', function(event) {
        flagQuitApp = true;
    });

    mainWindow.on('close', function(event) {
        if (mainWindow !== null && !flagQuitApp) {
            tray.minimizeMainWindow();
            event.preventDefault();
        } else {
           mainWindowState.saveState(mainWindow);
           appWindow.close();
        }
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.show();
    });

    mainWindow.webContents.on('new-window', function(ev, url, target) {
        if (target === '_system') {
            ev.preventDefault();
            require('shell').openExternal(url);
        } else if (target === '_blank') {
            ev.preventDefault();
            appWindow.loadUrl(url);
        }
    });
}

function onQuitApp() {
    if (!flagQuitApp) {
        flagQuitApp = true;
        if (mainWindow) {
            mainWindow.close();
        }
    }
}

function quit() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
}

ipc.on('open-dev', function() {
    mainWindow.openDevTools();
});

ipc.on('unread-changed', function(event, unread) {
    let showAlert = (unread !== null && unread !== undefined && unread !== '');
    if (process.platform === 'darwin') {
        app.dock.setBadge(String(unread || ''));
    }
    tray.showTrayAlert(showAlert);
});
