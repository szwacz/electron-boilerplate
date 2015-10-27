'use strict';

var app = require('app');
var Menu = require('menu');
var BrowserWindow = require('browser-window');


module.exports.setDevMenu = function () {

    var _lastWindow = null;

    var devMenu = Menu.buildFromTemplate([
        {
            label: 'Development',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'F5',
                    click: function () {
                        BrowserWindow.getFocusedWindow().reloadIgnoringCache();
                    }
                },
                {
                    label: 'Toggle DevTools',
                    accelerator: 'F12',
                    click: function () {
                        if(BrowserWindow.getFocusedWindow() || _lastWindow) {

                            _lastWindow = BrowserWindow.getFocusedWindow();

                            _lastWindow.toggleDevTools();
                        }
                    }
                },
                {
                    label: 'Quit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: function () {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Fullscreen',
                    accelerator: 'F11',
                    click: function () {
                        var win = BrowserWindow.getFocusedWindow();
                        win.setFullScreen(!win.isFullScreen());
                    }
                }
            ]
        },
        {
            label: 'Tasks',
            submenu: [
                {
                    label: 'Fullscreen',
                    accelerator: 'F11 a',
                    click: function () {
                        var win = BrowserWindow.getFocusedWindow();
                        win.setFullScreen(!win.isFullScreen());
                    }
                }
            ]
        },
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'Fullscreen',
                    accelerator: 'F11 b',
                    click: function () {

                    }
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(devMenu);
};
