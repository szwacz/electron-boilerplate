/* serverside system idle integration */
import {ipcMain} from 'electron';

var ffi = require('ffi'),
	idle = require('@paulcbetts/system-idle-time');

/* synchronous event process */
ipcMain.on('getSystemIdleTime', function(event) {
	/* why does this fire twice?!?!? */
	event.returnValue = idle.getIdleTime();
});

export default {
	getIdleTime: idle.getIdleTime,
	systemIdle: idle
}