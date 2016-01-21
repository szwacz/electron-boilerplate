

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

		this.deativeAll();
		var item = this.getByUrl(hostUrl);
		if (item) {
			item.classList.add('active');
		}
	}

	deativeAll() {
		var item;
		while (!!(item = this.getActive())) {
			item.classList.remove('active');
		}
	}
}

export var sidebar = new SideBar();
