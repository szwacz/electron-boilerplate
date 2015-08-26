global.IPC = require('ipc')

var events = ['unread-changed'];

events.forEach(function(e) {
	window.addEventListener(e, function(event) {
		IPC.send(e, event.detail);
	});
});

require('./menus');

var shell = require('shell');

global.supportExternalLinks = function (e) {
	var href;
	var isExternal = false;

	var checkDomElement = function (element) {
		if (element.nodeName === 'A') {
			if (element.classList.contains('swipebox') == false) {
				href = element.getAttribute('href') || '';
			}
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

windowOpen = window.open;
window.open = function() {
	result = windowOpen.apply(this, arguments);
	result.closed = false;
	return result;
}
