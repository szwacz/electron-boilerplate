'use strict';

import { remote } from 'electron';
import path from 'path';

var Tray = remote.Tray;
var Menu = remote.Menu;

let mainWindow = remote.getCurrentWindow();

var icons = {
    win32: {
        dir: 'windows'
    },

    linux: {
        dir: 'linux'
    },

    darwin: {
        dir: 'osx',
        icon: 'icon-trayTemplate.png'
    }
};

let _iconTray = path.join(__dirname, 'images', icons[process.platform].dir, icons[process.platform].icon || 'icon-tray.png');
let _iconTrayAlert = path.join(__dirname, 'images', icons[process.platform].dir, icons[process.platform].iconAlert || 'icon-tray-alert.png');

function createAppTray () {
    let _tray = new Tray(_iconTray);
    var contextMenu = Menu.buildFromTemplate([{
        label: 'Quit',
        click: function () {
            remote.app.quit();
        }

    }]);

    _tray.setToolTip(remote.app.getName());

    _tray.on('right-click', function (e, b) {
        _tray.popUpContextMenu(contextMenu, b);
    });

    _tray.on('click', function (e, b) {
        if (e.ctrlKey === true) {
            _tray.popUpContextMenu(contextMenu, b);
            return;
        }

        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }
    });

    mainWindow = mainWindow;
    mainWindow.tray = _tray;
}

function showTrayAlert (showAlert, title) {
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
