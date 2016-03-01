/* globals Meteor, Tracker, RocketChat */
'use strict';

var IPC = require('electron').ipcRenderer;

class Notification extends window.Notification {
	get onclick() {
		return super.onclick;
	}

	set onclick(fn) {
		var result = super.onclick = () => {
			IPC.sendToHost('focus');
			fn.apply(this, arguments);
		};
		return result;
	}
}

window.Notification = Notification;

var events = ['unread-changed'];

events.forEach(function(e) {
	window.addEventListener(e, function(event) {
		IPC.sendToHost(e, event.detail);
	});
});

window.addEventListener('load', function() {
	Meteor.startup(function() {
		Tracker.autorun(function() {
			var siteName = RocketChat.settings.get('Site_Name');
			if (siteName) {
				IPC.sendToHost('title-changed', siteName);
			}
		});
	});
});

var shell = require('shell');

var supportExternalLinks = function(e) {
	var href;
	var isExternal = false;

	var checkDomElement = function(element) {
		if (element.nodeName === 'A') {
			if (element.classList.contains('swipebox') === false) {
				href = element.getAttribute('href') || '';
			}
		}

		if (/^https?:\/\/.+/.test(href) === true /*&& RegExp('^https?:\/\/'+location.host).test(href) === false*/ ) {
			isExternal = true;
		}

		if (href && isExternal) {
			shell.openExternal(href);
			e.preventDefault();
		} else if (element.parentElement) {
			checkDomElement(element.parentElement);
		}
	};

	checkDomElement(e.target);
};

document.addEventListener('click', supportExternalLinks, false);

var webFrame = require('web-frame');
var remote = require('remote');
var webContents = remote.getCurrentWebContents();
var Menu = remote.require('menu');
var menu = new Menu();

// set the initial context menu so that a context menu exists even before spellcheck is called
var getTemplate = function() {
	return [
		{
			label: 'Undo',
			role: 'undo'
		},
		{
			label: 'Redo',
			role: 'redo'
		},
		{
			type: 'separator'
		},
		{
			label: 'Cut',
			role: 'cut'
		},
		{
			label: 'Copy',
			role: 'copy'
		},
		{
			label: 'Paste',
			role: 'paste'
		},
		{
			label: 'Select All',
			role: 'selectall'
		}
	];
};

let lastMisspelledWord;

try {
	var checker = require('spellchecker');

	webFrame.setSpellCheckProvider((localStorage.getItem('userLanguage') || 'en'), false, {
		spellCheck: function(text) {
			if (localStorage.getItem('userLanguage') && checker.getAvailableDictionaries().length > 0) {
				checker.setDictionary(localStorage.getItem('userLanguage'));
			}

			var isMisspelled = checker.isMisspelled(text);

			if (isMisspelled) {
				lastMisspelledWord = text;
			} else {
				lastMisspelledWord = undefined;
			}

			return !isMisspelled;
		}
	});
} catch(e) {
	console.log('Spellchecker unavailble');
}

window.addEventListener('contextmenu', function(event){
	event.preventDefault();

	const template = getTemplate();

	setTimeout(function() {
		if (['TEXTAREA', 'INPUT'].indexOf(event.target.nodeName) > -1) {
			const text = window.getSelection().toString().trim();
			if (text !== '' && checker.isMisspelled(text)) {
				const options = checker.getCorrectionsForMisspelling(lastMisspelledWord);
				const maxItems = Math.min(options.length, 5);

				if (maxItems > 0) {
					const suggestions = [];
					const onClick = function(menuItem) {
						webContents.replaceMisspelling(menuItem.label);
					};

					for (let i = 0; i < options.length; i++) {
						const item = options[i];
						suggestions.push({ label: item, click: onClick });
					}

					template.unshift({ type: 'separator' });

					if (suggestions.length > maxItems) {
						const morSuggestions = {
							label: 'More spelling suggestions',
							submenu: suggestions.slice(maxItems)
						};
						template.unshift(morSuggestions);
					}

					template.unshift.apply(template, suggestions.slice(0, maxItems));
				} else {
					template.unshift({ label: 'no suggestions', click: function() { } });
				}
			}
		}

		menu = Menu.buildFromTemplate(template);
		menu.popup(remote.getCurrentWindow());
	}, 0);
}, false);
