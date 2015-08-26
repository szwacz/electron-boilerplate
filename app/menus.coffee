'use strict'

remote = require 'remote'
Menu = remote.require 'menu'
app = remote.require 'app'
path = remote.require 'path'
APP_NAME = 'Rocket.Chat'

if process.platform is 'darwin'
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
					label: 'Connect to other server'
					click: ->
						window.location = 'file://' + path.join( __dirname, 'app.html?clearcache=true' );
				}
				{
					type: 'separator'
				}
				{
					label: 'Hide ' + APP_NAME
					accelerator: 'CmdOrCtrl+H'
					selector: 'hide:'
				}
				{
					label: 'Hide Others'
					accelerator: 'CmdOrCtrl+Shift+H'
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
					accelerator: 'CmdOrCtrl+Q'
					selector: 'terminate:'
				}
			]
		}
		{
			label: 'Edit'
			submenu: [
				{
					label: 'Undo'
					accelerator: 'CmdOrCtrl+Z'
					selector: 'undo:'
				}
				{
					label: 'Redo'
					accelerator: 'CmdOrCtrl+Shift+Z'
					selector: 'redo:'
				}
				{
					type: 'separator'
				}
				{
					label: 'Cut'
					accelerator: 'CmdOrCtrl+X'
					selector: 'cut:'
				}
				{
					label: 'Copy'
					accelerator: 'CmdOrCtrl+C'
					selector: 'copy:'
				}
				{
					label: 'Paste'
					accelerator: 'CmdOrCtrl+V'
					selector: 'paste:'
				}
				{
					label: 'Select All'
					accelerator: 'CmdOrCtrl+A'
					selector: 'selectAll:'
				}
			]
		}
		{
			label: 'View'
			submenu: [
				{
					label: 'Reload'
					accelerator: 'CmdOrCtrl+R'
					click: -> remote.getCurrentWindow().reload()
				}
				{
					label: 'Toggle DevTools'
					accelerator: 'CmdOrCtrl+Alt+I'
					click: -> remote.getCurrentWindow().toggleDevTools()
				}
			]
		}
		{
			label: 'Window'
			submenu: [
				{
					label: 'Minimize'
					accelerator: 'CmdOrCtrl+M'
					selector: 'performMiniaturize:'
				}
				{
					label: 'Close'
					accelerator: 'CmdOrCtrl+W'
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
else
	template = [
		{
			label: APP_NAME
			submenu: [
				{
					label: 'Quit'
					accelerator: 'CmdOrCtrl+Q'
					click: -> app.quit()
				}
			]
		}
		{
			label: 'View'
			submenu: [
				{
					label: 'Reload'
					accelerator: 'CmdOrCtrl+R'
					click: -> remote.getCurrentWindow().reload()
				}
				{
					label: 'Toggle DevTools'
					accelerator: 'CmdOrCtrl+Alt+I'
					click: -> remote.getCurrentWindow().toggleDevTools()
				}
			]
		}
		{
			label: 'Window'
			submenu: [
				{
					label: 'Close'
					accelerator: 'CmdOrCtrl+W'
					click: -> remote.getCurrentWindow().close()
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
