'use strict';

import { remote } from 'electron';
import { servers } from './servers';
import { sidebar } from './sidebar';
import { webview } from './webview';
import webFrame from 'web-frame';
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
					label: 'Original Zoom',
					accelerator: 'Command+0',
					click: function() {
						webFrame.setZoomLevel(0);
					}
				},
				{
					label: 'Zoom In',
					accelerator: 'Command+=',
					click: function() {
						webFrame.setZoomLevel(webFrame.getZoomLevel()+1);
					}
				},
				{
					label: 'Zoom Out',
					accelerator: 'Command+-',
					click: function() {
						webFrame.setZoomLevel(webFrame.getZoomLevel()-1);
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Reload - current server',
					accelerator: 'Command+R',
					click: function() {
						const activeWebview = webview.getActive();
						if (activeWebview) {
							activeWebview.reload();
						}
					}
				},
				{
					label: 'Toggle DevTools - current server',
					accelerator: 'Command+Alt+I',
					click: function() {
						const activeWebview = webview.getActive();
						if (activeWebview) {
							activeWebview.openDevTools();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Reload - application',
					accelerator: 'Command+Shift+R',
					click: function() {
						remote.getCurrentWindow().reload();
					}
				},
				{
					label: 'Toggle DevTools - application',
					click: function() {
						remote.getCurrentWindow().toggleDevTools();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Toggle server list',
					click: function() {
						sidebar.toggle();
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
					label: 'Original Zoom',
					accelerator: 'Command+0',
					click: function() {
						webFrame.setZoomLevel(0);
					}
				},
				{
					label: 'Zoom In',
					accelerator: 'Command+=',
					click: function() {
						webFrame.setZoomLevel(webFrame.getZoomLevel()+1);
					}
				},
				{
					label: 'Zoom Out',
					accelerator: 'Command+-',
					click: function() {
						webFrame.setZoomLevel(webFrame.getZoomLevel()-1);
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Reload - current server',
					accelerator: 'Ctrl+R',
					click: function() {
						const activeWebview = webview.getActive();
						if (activeWebview) {
							activeWebview.reload();
						}
					}
				},
				{
					label: 'Toggle DevTools - current server',
					accelerator: 'Ctrl+Shift+I',
					click: function() {
						const activeWebview = webview.getActive();
						if (activeWebview) {
							activeWebview.openDevTools();
						}
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Reload - application',
					accelerator: 'Ctrl+Shift+R',
					click: function() {
						remote.getCurrentWindow().reload();
					}
				},
				{
					label: 'Toggle DevTools - application',
					click: function() {
						remote.getCurrentWindow().toggleDevTools();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Toggle server list',
					click: function() {
						sidebar.toggle();
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
