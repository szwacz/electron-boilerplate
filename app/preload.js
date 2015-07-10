global.IPC = require('ipc')

var events = ['unread-changed'];

events.forEach(function(e) {
	window.addEventListener(e, function(event) {
		IPC.send(e, event.detail);
	});
});

require('./menus');
