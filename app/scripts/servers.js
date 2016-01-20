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
				hosts = {};
				hosts[hosts] = {
					title: hosts,
					url: hosts
				};
			}

			localStorage.setItem(this.hostsKey, JSON.stringify(hosts));
		}

		if (hosts === null) {
			hosts = {};
		}

		if (Array.isArray(hosts)) {
			var oldHosts = hosts;
			hosts = {};
			oldHosts.forEach(function(item) {
				hosts[item] = {
					title: item,
					url: item
				};
			});
			localStorage.setItem(this.hostsKey, JSON.stringify(hosts));
		}

		this._hosts = hosts;
	}

	save() {
		localStorage.setItem(this.hostsKey, JSON.stringify(this._hosts));
	}

	validateHost(host, timeout) {
		console.log('Validating host', host);
		timeout = timeout || 5000;
		return new Promise(function(resolve, reject) {
			var resolved = false;
			$.getJSON(`${host}/api/info`).then(function() {
				if (resolved) {
					return;
				}
				resolved = true;
				console.log('Host valid', host);
				resolve();
			},function(request) {
				if (resolved) {
					return;
				}
				resolved = true;
				console.log('Host invalid', host);
				reject(request.status);
			});
			if (timeout) {
				setTimeout(function() {
					if (resolved) {
						return;
					}
					resolved = true;
					console.log('Validating host TIMEOUT', host);
					reject();
				}, timeout);
			}
		});
	}

	hostExists(host) {
		var hosts = this.hosts;

		return !!hosts[host];
	}

	addHost(host) {
		var hosts = this.hosts;

		if (this.hostExists(host) === true) {
			return false;
		}

		hosts[host] = {
			title: host,
			url: host
		};
		this.hosts = hosts;

		return true;
	}

	remove(host) {
		var hosts = this.hosts;
		delete hosts[host];

		this.hosts = hosts;
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
