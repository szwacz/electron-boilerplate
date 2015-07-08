global.IPC = require('ipc')

var events = ['set-badge'];

events.forEach(function(e) {
	window.addEventListener(e, function(event) {
		IPC.send(e, event.detail);
	});
});