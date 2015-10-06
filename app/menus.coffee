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
					label: 'Change server'
					click: ->
						document.querySelector('.rocket-app').style.display = 'none'
						document.querySelector('.landing-page').style.display = 'block'
						activeItem = document.querySelector('.server-list li.active')
						localStorage.removeItem('rocket.chat.currentHost')
						if activeItem
							activeItem.classList.remove('active')
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
					label: 'Toggle server list'
					click: ->
						localStorage.setItem 'server-list-closed', document.body.classList.toggle('hide-server-list')
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
					label: 'Change server'
					click: ->
						document.querySelector('.rocket-app').style.display = 'none'
						document.querySelector('.landing-page').style.display = 'block'
						activeItem = document.querySelector('.server-list li.active')
						localStorage.removeItem('rocket.chat.currentHost')
						if activeItem
							activeItem.classList.remove('active')
				}
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
					label: 'Toggle server list'
					click: ->
						localStorage.setItem 'server-list-closed', document.body.classList.toggle('hide-server-list')
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

selectedInstance = null
instanceMenu = Menu.buildFromTemplate [
	label: 'Remove server'
	click: ->
		hosts = localStorage.getItem('rocket.chat.hosts')
		hosts = JSON.parse(hosts);

		selectedInstance.parentNode.removeChild selectedInstance

		newHosts = []
		for instance in hosts
			unless instance is selectedInstance.dataset.host
				newHosts.push instance

		localStorage.setItem 'rocket.chat.hosts', JSON.stringify newHosts
]

Menu.setApplicationMenu Menu.buildFromTemplate(template)

menu = Menu.buildFromTemplate template[1].submenu

window.addEventListener 'contextmenu', (e) ->
	e.preventDefault()

	if e.target.classList.contains('instance') or e.target.parentNode.classList.contains('instance')
		if e.target.classList.contains('instance')
			selectedInstance = e.target
		else
			selectedInstance = e.target.parentNode

		instanceMenu.popup remote.getCurrentWindow()
	else
		menu.popup remote.getCurrentWindow()
, false

module.exports = [menu]
