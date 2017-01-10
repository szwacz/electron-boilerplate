// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import os from 'os';
import { app, ipcMain } from 'electron';
import windowStateKeeper from './background/windowState';
import certificate from './background/certificate';
import Toaster from 'electron-toaster';
import idle from '@paulcbetts/system-idle-time';

process.env.GOOGLE_API_KEY = 'AIzaSyADqUh_c1Qhji3Cp1NE43YrcpuPkmhXD-c';

/* system idle time synchronous event process */
ipcMain.on('getSystemIdleTime', function(event) {
	/* why does this fire twice?!?!? */
	event.returnValue = idle.getIdleTime();
});

export function afterMainWindow(mainWindow) {
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

	if (mainWindowState.x !== undefined && mainWindowState.y !== undefined) {
		mainWindow.setPosition(mainWindowState.x, mainWindowState.y, false);
	}
	if (mainWindowState.width !== undefined && mainWindowState.height !== undefined) {
		mainWindow.setSize(mainWindowState.width, mainWindowState.height, false);
	}
	mainWindow.setMinimumSize(600, 400);

	if (mainWindowState.isMaximized) {
		mainWindow.maximize();
	}

	if (mainWindowState.isMinimized) {
		mainWindow.minimize();
	}

	if (mainWindowState.isHidden) {
		mainWindow.hide();
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

	// ==== Quick check to fetch Operating System and it's version ==>>
	// Add here any OS without native support for notifications to Toaster is used
	var useToaster = false;

	// Windows 7 or older
	if (os.platform() === 'win32' || os.platform() === 'win64') {
		if (parseFloat(os.release()) < 6.2) {
			useToaster = true;
		}
	};

	if (useToaster) {
		const toaster = new Toaster();
		toaster.init(mainWindow);

		ipcMain.on('notification-shim', (e, msg) => {
			mainWindow.webContents.executeJavaScript(`
				require('electron').ipcRenderer.send('electron-toaster-message', {
					title: '${msg.title}',
					message: \`${msg.options.body}\`,
					width: 400,
					focus: false,
					htmlFile: 'file://'+__dirname+'/notification.html?'
				});
			`);
		});
	};

	certificate.initWindow(mainWindow);
}
