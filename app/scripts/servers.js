/* globals $ */

class Servers {
	constructor() {
		this.load();
	}

	get hosts() {
		return this._hosts;
	}

	set hosts(hosts) {
		this._hosts = hosts;
		this.save();
		return true;
	}

	get hostsKey() {
		return 'rocket.chat.hosts';
	}

	get activeKey() {
		return 'rocket.chat.currentHost';
	}

	load() {
		var hosts = localStorage.getItem(this.hostsKey);

		try {
			hosts = JSON.parse(hosts);
		} catch (e) {
			if (typeof hosts === 'string' && hosts.match(/^https?:\/\//)) {
				hosts = [hosts];
			}

			localStorage.setItem(this.hostsKey, JSON.stringify(hosts));
		}

		if (hosts === null) {
			hosts = [];
		}

		this._hosts = hosts;
	}

	save() {
		localStorage.setItem(this.hostsKey, JSON.stringify(this._hosts));
	}

	validateHost(host, timeout) {
		timeout = timeout || 5000;
		return new Promise(function(resolve, reject) {
			var resolved = false;
			$.getJSON(`${host}/api/info`).then(function() {
				if (resolved) {
					return;
				}
				resolved = true;
				resolve();
			},function(request) {
				if (resolved) {
					return;
				}
				resolved = true;
				reject(request.status);
			});
			if (timeout) {
				setTimeout(function() {
					if (!resolved) {
						return;
					}
					resolved = true;
					reject();
				}, timeout);
			}
		});
	}

	hostExists(host) {
		var hosts = this.hosts;

		hosts.some(function(item) {
			if (item === host) {
				return true;
			}
		});
		return false;
	}

	addHost(host) {
		var hosts = this.hosts;

		if (this.hostExists(host) === true) {
			return false;
		}

		hosts.push(host);
		this.hosts = hosts;

		return true;
	}

	get active() {
		localStorage.getItem(this.activeKey);
	}

	setActive(host) {
		if (this.hostExists(host)) {
			localStorage.setItem(this.activeKey, host);
			return true;
		}
		return false;
	}
}

export var servers = new Servers();
