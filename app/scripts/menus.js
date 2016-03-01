'use strict';

import { remote } from 'electron';
import { servers } from './servers';
import { sidebar } from './sidebar';
import config from './config';
import '../branding/branding.js';

var quit = remote.require('./quit');

var Menu = remote.Menu;
var APP_NAME = config.name;
var template;

document.title = APP_NAME;

if (process.platform === 'darwin') {
	template = [
		{
			label: APP_NAME,
			submenu: [
				{
					label: 'About ' + APP_NAME,
					role: 'about'
				},
				{
					type: 'separator'
				},
				{
					label: 'Add new server',
					accelerator: 'Command+N',
					click: function() {
						servers.clearActive();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Hide ' + APP_NAME,
					accelerator: 'Command+H',
					role: 'hide'
				},
				{
					label: 'Hide Others',
					accelerator: 'Command+Alt+H',
					role: 'hideothers'
				},
				{
					label: 'Show All',
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit',
					accelerator: 'Command+Q',
					click: function() {
						quit.forceQuit();
					}
				}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'Command+Z',
					role: 'undo'
				},
				{
					label: 'Redo',
					accelerator: 'Command+Shift+Z',
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					label: 'Cut',
					accelerator: 'Command+X',
					role: 'cut'
				},
				{
					label: 'Copy',
					accelerator: 'Command+C',
					role: 'copy'
				},
				{
					label: 'Paste',
					accelerator: 'Command+V',
					role: 'paste'
				},
				{
					label: 'Select All',
					accelerator: 'Command+A',
					role: 'selectall'
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'Command+R',
					click: function() {
						remote.getCurrentWindow().reload();
					}
				},
				{
					label: 'Toggle server list',
					click: function() {
						sidebar.toggle();
					}
				},
				{
					label: 'Toggle DevTools',
					accelerator: 'Command+Alt+I',
					click: function() {
						remote.getCurrentWindow().toggleDevTools();
					}
				}
			]
		},
		{
			label: 'Window',
			id: 'window',
			submenu: [
				{
					label: 'Minimize',
					accelerator: 'Command+M',
					role: 'minimize'
				},
				{
					label: 'Close',
					accelerator: 'Command+W',
					role: 'close'
				},
				{
					type: 'separator'
				},
				{
					type: 'separator',
					id: 'server-list-separator',
					visible: false
				},
				{
					label: 'Bring All to Front',
					role: 'front'
				}
			]
		}
	];
} else {
	template = [
		{
			label: APP_NAME,
			submenu: [
				{
					label: 'Add new server',
					accelerator: 'Ctrl+N',
					click: function() {
						servers.clearActive();
					}
				},
				{
					label: 'Quit',
					accelerator: 'Ctrl+Q',
					click: function() {
						quit.forceQuit();
					}
				}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'Ctrl+Z',
					role: 'undo'
				},
				{
					label: 'Redo',
					accelerator: 'Ctrl+Shift+Z',
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					label: 'Cut',
					accelerator: 'Ctrl+X',
					role: 'cut'
				},
				{
					label: 'Copy',
					accelerator: 'Ctrl+C',
					role: 'copy'
				},
				{
					label: 'Paste',
					accelerator: 'Ctrl+V',
					role: 'paste'
				},
				{
					label: 'Select All',
					accelerator: 'Ctrl+A',
					role: 'selectall'
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'Ctrl+R',
					click: function() {
						remote.getCurrentWindow().reload();
					}
				},
				{
					label: 'Toggle server list',
					click: function() {
						sidebar.toggle();
					}
				},
				{
					label: 'Toggle DevTools',
					accelerator: 'Ctrl+Shift+I',
					click: function() {
						remote.getCurrentWindow().toggleDevTools();
					}
				}
			]
		},
		{
			label: 'Window',
			id: 'window',
			submenu: [
				{
					type: 'separator',
					id: 'server-list-separator',
					visible: false
				},
				{
					label: 'Close',
					accelerator: 'Ctrl+W',
					click: function() {
						remote.getCurrentWindow().close();
					}
				}
			]
		}
	];
}

export var menuTemplate = template;
export var menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);
