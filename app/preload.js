global.IPC = require('ipc')

var events = ['unread-changed'];

events.forEach(function(e) {
	window.addEventListener(e, function(event) {
		IPC.send(e, event.detail);
	});
});

require('./menus');

var shell = require('shell');

var supportExternalLinks = function (e) {
	var href;
	var isExternal = false;

	var checkDomElement = function (element) {
		if (element.nodeName === 'A') {
			href = element.getAttribute('href') || '';
		}

		if (/^https?:\/\/.+/.test(href) === true /*&& RegExp('^https?:\/\/'+location.host).test(href) === false*/) {
			isExternal = true;
		}

		if (href && isExternal) {
			shell.openExternal(href);
			e.preventDefault();
		} else if (element.parentElement) {
			checkDomElement(element.parentElement);
		}
	}

	checkDomElement(e.target);
}

document.addEventListener('click', supportExternalLinks, false);