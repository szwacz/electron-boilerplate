(function () {'use strict';

var electron = require('electron');

let servers = {};

var servers$1 = {
	loadServers(s) {
		servers = s;
	},

	getServers() {
		return servers;
	}
};

electron.app.on('login', function(event, webContents, request, authInfo, callback) {
	for (let url in servers) {
		const server = servers[url];
		if (request.url.indexOf(url) === 0 && server.username) {
			callback(server.username, server.password);
			break;
		}
	}
});

module.exports = servers$1;

}());
//# sourceMappingURL=servers.js.map