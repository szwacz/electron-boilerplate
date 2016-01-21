import { EventEmitter } from 'events';
import { servers } from './servers';

class SideBar extends EventEmitter {
	constructor() {
		super();

		this.listElement = document.getElementById('serverList');

		servers.forEach((host) => {
			this.add(host);
		});

		servers.on('host-added', (hostUrl) => {
			this.add(servers.get(hostUrl));
		});

		servers.on('active-setted', (hostUrl) => {
			this.setActive(hostUrl);
		});

		servers.on('active-cleared', (hostUrl) => {
			this.deactiveAll(hostUrl);
		});

		servers.on('title-setted', (hostUrl, title) => {
			this.setLabel(hostUrl, title);
		});

		if (this.isHidden()) {
			this.hide();
		} else {
			this.show();
		}
	}

	add(host) {
		var url = host.url;
		var name = host.title.replace(/^https?:\/\/(?:www\.)?([^\/]+)(.*)/, '$1');
		name = name.split('.');
		name = name[0][0] + (name[1] ? name[1][0] : '');
		name = name.toUpperCase();

		var initials = document.createElement('span');
		initials.innerHTML = name;

		var tooltip = document.createElement('div');
		tooltip.classList.add('tooltip');
		tooltip.innerHTML = host.title;

		var badge = document.createElement('div');
		badge.classList.add('badge');

		var img = document.createElement('img');
		img.onload = function() {
			img.style.display = 'initial';
			initials.style.display = 'none';
		};
		img.src = `${url}/assets/favicon.svg?v=3`;

		var item = document.createElement('li');
		item.appendChild(initials);
		item.appendChild(tooltip);
		item.appendChild(badge);
		item.appendChild(img);

		item.dataset.host = url;
		item.setAttribute('server', url);
		item.classList.add('instance');

		item.onclick = () => {
			this.emit('click', host.url);
			servers.setActive(host.url);
		};

		this.listElement.appendChild(item);
	}

	getByUrl(hostUrl) {
		return this.listElement.querySelector(`.instance[server="${hostUrl}"]`);
	}

	getActive() {
		return this.listElement.querySelector(`.instance.active`);
	}

	isActive(hostUrl) {
		return !!this.listElement.querySelector(`.instance.active[server="${hostUrl}"]`);
	}

	setActive(hostUrl) {
		if (this.isActive(hostUrl)) {
			return;
		}

		this.deactiveAll();
		var item = this.getByUrl(hostUrl);
		if (item) {
			item.classList.add('active');
		}
	}

	deactiveAll() {
		var item;
		while (!!(item = this.getActive())) {
			item.classList.remove('active');
		}
	}

	setLabel(hostUrl, label) {
		this.listElement.querySelector(`.instance[server="${hostUrl}"] .tooltip`).innerHTML = label;
	}

	setBadge(hostUrl, badge) {
		var item = this.getByUrl(hostUrl);
		var badgeEl = item.querySelector('.badge');

		if (badge !== null && badge !== undefined && badge !== '') {
			item.classList.add('unread');
			badgeEl.innerHTML = badge;
		} else {
			badge = undefined;
			item.classList.remove('unread');
			badgeEl.innerHTML = '';
		}
		this.emit('badge-setted', hostUrl, badge);
	}

	getGlobalBadge() {
		var count = 0;
		var alert = '';
		var badgeEls = this.listElement.querySelectorAll(`li.instance .badge`);
		for (var i = badgeEls.length - 1; i >= 0; i--) {
			var badgeEl = badgeEls[i];
			var text = badgeEl.innerHTML;
			if (!isNaN(parseInt(text))) {
				count += parseInt(text);
			}
			if (alert === '' && text === '•') {
				alert = text;
			}
		}

		if (count > 0) {
			return String(count);
		} else {
			return alert;
		}
	}

	hide() {
		document.body.classList.add('hide-server-list');
		localStorage.setItem('sidebar-closed', 'true');
		this.emit('hide');
	}

	show() {
		document.body.classList.remove('hide-server-list');
		localStorage.setItem('sidebar-closed', 'false');
		this.emit('show');
	}

	isHidden() {
		return localStorage.getItem('sidebar-closed') === 'true';
	}
}

export var sidebar = new SideBar();
