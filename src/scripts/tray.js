'use strict';

import { remote } from 'electron';
import path from 'path';

const { Tray, Menu } = remote;

const mainWindow = remote.getCurrentWindow();

const icons = {
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

const _iconTray = path.join(__dirname, 'images', icons[process.platform].dir, icons[process.platform].icon || 'icon-tray.png');
const _iconTrayAlert = path.join(__dirname, 'images', icons[process.platform].dir, icons[process.platform].iconAlert || 'icon-tray-alert.png');

function createAppTray () {
    const _tray = new Tray(_iconTray);
    const contextMenuShow = Menu.buildFromTemplate([{
        label: 'Show',
        click () {
            mainWindow.show();
        }
    }, {
        label: 'Quit',
        click () {
            remote.app.quit();
        }
    }]);

    const contextMenuHide = Menu.buildFromTemplate([{
        label: 'Hide',
        click () {
            mainWindow.hide();
        }
    }, {
        label: 'Quit',
        click () {
            remote.app.quit();
        }
    }]);

    if (!mainWindow.isMinimized() && !mainWindow.isVisible()) {
        _tray.setContextMenu(contextMenuShow);
    } else {
        _tray.setContextMenu(contextMenuHide);
    }

    mainWindow.on('show', () => {
        _tray.setContextMenu(contextMenuHide);
    });

    mainWindow.on('hide', () => {
        _tray.setContextMenu(contextMenuShow);
    });

    _tray.setToolTip(remote.app.getName());

    _tray.on('right-click', function (e, b) {
        _tray.popUpContextMenu(undefined, b);
    });

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
