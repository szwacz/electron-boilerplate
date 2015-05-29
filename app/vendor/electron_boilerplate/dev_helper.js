'use strict';

var app = require('app');
var Menu = require('menu');
var BrowserWindow = require('browser-window');

module.exports.setDevMenu = function () {
    var devMenu = Menu.buildFromTemplate([{
        label: 'Development',
        submenu: [{
            label: 'Reload',
            accelerator: 'Command+R',
            click: function () {
                BrowserWindow.getFocusedWindow().reloadIgnoringCache();
            }
        },{
            label: 'Toggle DevTools',
            accelerator: 'Alt+Command+I',
            click: function () {
                BrowserWindow.getFocusedWindow().toggleDevTools();
            }
        },{
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function () {
                app.quit();
            }
        }]
    }]);
    Menu.setApplicationMenu(devMenu);
};
