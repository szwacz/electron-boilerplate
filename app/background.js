// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import os from 'os';
import { app, BrowserWindow, ipcMain } from 'electron';
import devHelper from './vendor/electron_boilerplate/dev_helper';
import windowStateKeeper from './vendor/electron_boilerplate/window_state';
import certificate from './certificate';
import Toaster from 'electron-toaster';
const toaster = new Toaster();

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

/* serverside system idle integration */
var ffi = require('ffi'),
    idle = require('@paulcbetts/system-idle-time');

var mainWindow;

if (process.platform !== 'darwin') {
    var shouldQuit = app.makeSingleInstance(function() {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    if (shouldQuit) {
        app.quit();
    }
}

// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 1000,
    height: 600
});

// ==== Quick check to fetch Operating System and it's version ==>>
// Add here any OS without native support for notifications to Toaster is used
var useToaster = false;

// Windows 7 or older
if (os.platform() === 'win32' || os.platform() === 'win64') {
    if (parseFloat(os.release()) < 6.2) useToaster = true;
};
// =========================================================================>>

app.on('ready', function () {

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 600,
        minHeight: 400
    });

    if (mainWindowState.isMaximized) {
        mainWindow.maximize();
    }

    if (mainWindowState.isMinimized) {
        mainWindow.minimize();
    }

    if (mainWindowState.isHidden) {
        mainWindow.hide();
    }

    if (env.name === 'test') {
        mainWindow.loadURL('file://' + __dirname + '/spec.html');
    } else {
        mainWindow.loadURL('file://' + __dirname + '/app.html');
    }

    if (env.name !== 'production') {
        devHelper.setDevMenu();
        mainWindow.openDevTools();
    }

    mainWindow.on('close', function (event) {
        if (mainWindow.forceClose) {
            mainWindowState.saveState(mainWindow);
            return;
        }
        event.preventDefault();
        mainWindow.hide();
        mainWindowState.saveState(mainWindow);
    });

    app.on('before-quit', function() {
        mainWindowState.saveState(mainWindow);
        mainWindow.forceClose = true;
    });

    mainWindow.on('resize', function() {
        mainWindowState.saveState(mainWindow);
    });

    mainWindow.on('move', function() {
        mainWindowState.saveState(mainWindow);
    });

    app.on('activate', function(){
        mainWindow.show();
    });

    mainWindow.webContents.on('will-navigate', function(event) {
        event.preventDefault();
    });

	if(useToaster) {

	    toaster.init(mainWindow);

		ipcMain.on('notification-shim', (e, msg) => {

			mainWindow.webContents.executeJavaScript(`
				require('electron').ipcRenderer.send('electron-toaster-message', {
					title: '${msg.title}',
					message: \`${msg.options.body}\`,
					width: 400,
					htmlFile: 'file://'+__dirname+'/notification.html?'
				});
			`);
		});
	};


    certificate.initWindow(mainWindow);
});

app.on('window-all-closed', function () {
    app.quit();
});

/* system idle time synchronous event process */
ipcMain.on('getSystemIdleTime', function(event) {
    /* why does this fire twice?!?!? */
    event.returnValue = idle.getIdleTime();
});
