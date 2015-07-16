'use strict'

remote = require 'remote'
Menu = remote.require 'menu'
APP_NAME = 'Rocket.Chat'

template = [
	{
		label: APP_NAME
		submenu: [
			{
				label: 'About ' + APP_NAME
				selector: 'orderFrontStandardAboutPanel:'
			}
			{
				type: 'separator'
			}
			{
				label: 'Hide ' + APP_NAME
				accelerator: 'Command+H'
				selector: 'hide:'
			}
			{
				label: 'Hide Others'
				accelerator: 'Command+Shift+H'
				selector: 'hideOtherApplications:'
			}
			{
				label: 'Show All'
				selector: 'unhideAllApplications:'
			}
			{
				type: 'separator'
			}
			{
				label: 'Quit'
				accelerator: 'Command+Q'
				selector: 'terminate:'
			}
		]
	}
	{
		label: 'Edit'
		submenu: [
			{
				label: 'Undo'
				accelerator: 'Command+Z'
				selector: 'undo:'
			}
			{
				label: 'Redo'
				accelerator: 'Shift+Command+Z'
				selector: 'redo:'
			}
			{
				type: 'separator'
			}
			{
				label: 'Cut'
				accelerator: 'Command+X'
				selector: 'cut:'
			}
			{
				label: 'Copy'
				accelerator: 'Command+C'
				selector: 'copy:'
			}
			{
				label: 'Paste'
				accelerator: 'Command+V'
				selector: 'paste:'
			}
			{
				label: 'Select All'
				accelerator: 'Command+A'
				selector: 'selectAll:'
			}
		]
	}
	{
		label: 'View'
		submenu: [
			{
				label: 'Reload'
				accelerator: 'Command+R'
				click: -> remote.getCurrentWindow().reload()
			}
			# {
			#   label: 'Toggle DevTools'
			#   accelerator: 'Alt+Command+I'
			#   click: -> remote.getCurrentWindow().toggleDevTools();
			# }
		]
	}
	{
		label: 'Window'
		submenu: [
			{
				label: 'Minimize'
				accelerator: 'Command+M'
				selector: 'performMiniaturize:'
			}
			{
				label: 'Close'
				accelerator: 'Command+W'
				selector: 'performClose:'
			}
			{
				type: 'separator'
			}
			{
				label: 'Bring All to Front'
				selector: 'arrangeInFront:'
			}
		]
	}
]

Menu.setApplicationMenu Menu.buildFromTemplate(template)

menu = Menu.buildFromTemplate template[1].submenu

window.addEventListener 'contextmenu', (e) ->
	e.preventDefault()
	menu.popup remote.getCurrentWindow()
, false

module.exports = [menu]
