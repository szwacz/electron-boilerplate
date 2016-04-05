'use strict';

import { remote } from 'electron';
import path from 'path';

var Tray = remote.Tray;
var Menu = remote.Menu;

let mainWindow = remote.getCurrentWindow();

var icons = {
    'win32': {
        dir: 'windows'
    },

    'linux': {
        dir: 'linux'
    },

    'darwin': {
        dir: 'osx',
        icon: 'icon-trayTemplate.png'
    }
};

let _iconTray = path.join(__dirname, 'images', icons[process.platform].dir, icons[process.platform].icon || 'icon-tray.png');
let _iconTrayAlert = path.join(__dirname, 'images', icons[process.platform].dir, icons[process.platform].iconAlert || 'icon-tray-alert.png');

function createAppTray() {
    let _tray = new Tray(_iconTray);
    var contextMenu = Menu.buildFromTemplate([{
        label: 'Hide',
        click: function() {
            mainWindow.hide();
        }
    }, {
        label: 'Show',
        click: function() {
            mainWindow.show();
        }
    }, {
        label: 'Quit',
        click: function() {
            remote.app.quit();
        }
    }]);
    _tray.setToolTip(remote.app.getName());
    _tray.setContextMenu(contextMenu);

    if (process.platform === 'darwin' || process.platform === 'win32') {
        _tray.on('double-click', function() {
            mainWindow.show();
        });
    } else {
        let dblClickDelay = 500,
            dblClickTimeoutFct = null;
        _tray.on('click', function() {
            if (!dblClickTimeoutFct) {
                dblClickTimeoutFct = setTimeout(function() {
                    // Single click, do nothing for now
                    dblClickTimeoutFct = null;
                }, dblClickDelay);
            } else {
                clearTimeout(dblClickTimeoutFct);
                dblClickTimeoutFct = null;
                mainWindow.show();
            }
        });
    }

    mainWindow = mainWindow;
    mainWindow.tray = _tray;
}

function showTrayAlert(showAlert, title) {
    if (mainWindow.tray === null || mainWindow.tray === undefined) {
        return;
    }

    mainWindow.flashFrame(showAlert);
    if (showAlert) {
        mainWindow.tray.setImage(_iconTrayAlert);
        if (process.platform === 'darwin') {
            mainWindow.tray.setTitle(title);
        }
    } else {
        mainWindow.tray.setImage(_iconTray);
        if (process.platform === 'darwin') {
            mainWindow.tray.setTitle(title);
        }
    }
}

createAppTray();

export default {
    showTrayAlert: showTrayAlert
};
