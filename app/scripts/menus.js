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

if (process.platform === 'darwin') {
	template = [
		{
			label: APP_NAME,
			submenu: [
				{
					label: 'About ' + APP_NAME,
					selector: 'orderFrontStandardAboutPanel:'
				},
				{
					type: 'separator'
				},
				{
					label: 'Change server',
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
					selector: 'hide:'
				},
				{
					label: 'Hide Others',
					accelerator: 'CmdOrCtrl+Shift+H',
					selector: 'hideOtherApplications:'
				},
				{
					label: 'Show All',
					selector: 'unhideAllApplications:'
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit',
					accelerator: 'CmdOrCtrl+Q',
					selector: 'terminate:'
				}
			]
		},
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Undo',
					accelerator: 'CmdOrCtrl+Z',
					selector: 'undo:'
				},
				{
					label: 'Redo',
					accelerator: 'CmdOrCtrl+Shift+Z',
					selector: 'redo:'
				},
				{
					type: 'separator'
				},
				{
					label: 'Cut',
					accelerator: 'CmdOrCtrl+X',
					selector: 'cut:'
				},
				{
					label: 'Copy',
					accelerator: 'CmdOrCtrl+C',
					selector: 'copy:'
				},
				{
					label: 'Paste',
					accelerator: 'CmdOrCtrl+V',
					selector: 'paste:'
				},
				{
					label: 'Select All',
					accelerator: 'CmdOrCtrl+A',
					selector: 'selectAll:'
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
			submenu: [
				{
					label: 'Minimize',
					accelerator: 'CmdOrCtrl+M',
					selector: 'performMiniaturize:'
				},
				{
					label: 'Close',
					accelerator: 'CmdOrCtrl+W',
					selector: 'performClose:'
				},
				{
					type: 'separator'
				},
				{
					label: 'Bring All to Front',
					selector: 'arrangeInFront:'
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
					label: 'Change server',
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
			submenu: [
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

Menu.setApplicationMenu(Menu.buildFromTemplate(template));
