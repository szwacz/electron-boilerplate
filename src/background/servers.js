import { app } from 'electron';

let servers = {};

export default {
    loadServers (s) {
        servers = s;
    },

    getServers () {
        return servers;
    }
};

app.on('login', function (event, webContents, request, authInfo, callback) {
    for (const url of Object.keys(servers)) {
        const server = servers[url];
        if (request.url.indexOf(url) === 0 && server.username) {
            callback(server.username, server.password);
            break;
        }
    }
});
