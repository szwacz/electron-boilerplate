'use strict';

import { remote } from 'electron';
import { servers } from './servers';
import { sidebar } from './sidebar';
import config from './config';
import '../branding/branding.js';

var Menu = remote.Menu;
var app = remote.App;
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
					click: function() {
						servers.clearActive();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Hide ' + APP_NAME,
					accelerator: 'CmdOrCtrl+H',
					role: 'hide'
				},
				{
					label: 'Hide Others',
					accelerator: 'CmdOrCtrl+Shift+H',
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
					accelerator: 'CmdOrCtrl+Q',
					role: 'terminate'
				}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'CmdOrCtrl+Z',
					role: 'undo'
				},
				{
					label: 'Redo',
					accelerator: 'CmdOrCtrl+Shift+Z',
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					label: 'Cut',
					accelerator: 'CmdOrCtrl+X',
					role: 'cut'
				},
				{
					label: 'Copy',
					accelerator: 'CmdOrCtrl+C',
					role: 'copy'
				},
				{
					label: 'Paste',
					accelerator: 'CmdOrCtrl+V',
					role: 'paste'
				},
				{
					label: 'Select All',
					accelerator: 'CmdOrCtrl+A',
					role: 'selectall'
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
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
					accelerator: 'CmdOrCtrl+Alt+I',
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
					accelerator: 'CmdOrCtrl+M',
					role: 'minimize'
				},
				{
					label: 'Close',
					accelerator: 'CmdOrCtrl+W',
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
					click: function() {
						servers.clearActive();
					}
				},
				{
					label: 'Quit',
					accelerator: 'CmdOrCtrl+Q',
					click: function() {
						app.quit();
					}
				}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'CmdOrCtrl+Z',
					role: 'undo'
				},
				{
					label: 'Redo',
					accelerator: 'CmdOrCtrl+Shift+Z',
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					label: 'Cut',
					accelerator: 'CmdOrCtrl+X',
					role: 'cut'
				},
				{
					label: 'Copy',
					accelerator: 'CmdOrCtrl+C',
					role: 'copy'
				},
				{
					label: 'Paste',
					accelerator: 'CmdOrCtrl+V',
					role: 'paste'
				},
				{
					label: 'Select All',
					accelerator: 'CmdOrCtrl+A',
					role: 'selectall'
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
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
					accelerator: 'CmdOrCtrl+Alt+I',
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
					accelerator: 'CmdOrCtrl+W',
					click: function() {
						remote.getCurrentWindow().close();
					}
				}
			]
		}
	];
}

export var menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);
