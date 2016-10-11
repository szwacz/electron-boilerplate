/* globals Meteor, Tracker, RocketChat */
'use strict';

var IPC = require('electron').ipcRenderer;

require('electron-notification-shim')();

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

var path = remote.require('path');

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

let languagesMenu;
let checker;
const enabledDictionaries = [];
let availableDictionaries = [];
let dictionariesPath;

if (localStorage.getItem('spellcheckerDictionaries')) {
	let spellcheckerDictionaries = JSON.parse(localStorage.getItem('spellcheckerDictionaries'));
	if (Array.isArray(spellcheckerDictionaries)) {
		enabledDictionaries.push.apply(enabledDictionaries, spellcheckerDictionaries);
	}
}

const saveEnabledDictionaries = function() {
	localStorage.setItem('spellcheckerDictionaries', JSON.stringify(enabledDictionaries));
};

const isCorrect = function(text) {
	if (!checker) {
		return true;
	}

	let isCorrect = false;
	enabledDictionaries.forEach(function(enabledDictionary) {
		if (availableDictionaries.indexOf(enabledDictionary) === -1) {
			return;
		}

		checker.setDictionary(enabledDictionary, dictionariesPath);
		if (!checker.isMisspelled(text)) {
			isCorrect = true;
		}
	});

	return isCorrect;
};

const getCorrections = function(text) {
	// Create an array of arrays of corrections
	// One array of corrections per language
	let allCorrections = [];
	enabledDictionaries.forEach(function(enabledDictionary) {
		if (availableDictionaries.indexOf(enabledDictionary) === -1) {
			return;
		}

		checker.setDictionary(enabledDictionary, dictionariesPath);
		const languageCorrections = checker.getCorrectionsForMisspelling(text);
		if (languageCorrections.length > 0) {
			allCorrections.push(languageCorrections);
		}
	});

	// Get the size of biggest array
	let length = 0;
	allCorrections.forEach(function(items) {
		length = Math.max(length, items.length);
	});

	// Merge all arrays until the size of the biggest array
	// To get the best suggestions of each language first
	// Ex: [[1,2,3], [a,b]] => [1,a,2,b,3]
	const corrections = [];
	for (let i = 0; i < length; i++) {
		for (var j = 0; j < allCorrections.length; j++) {
			if (allCorrections[j][i]) {
				corrections.push(allCorrections[j][i]);
			}
		}
	}

	// Remove duplicateds
	corrections.forEach(function(item, index) {
		const dupIndex = corrections.indexOf(item, index+1);
		if (dupIndex > -1) {
			corrections.splice(dupIndex, 1);
		}
	});

	return corrections;
};

try {
	checker = require('spellchecker');

	availableDictionaries = checker.getAvailableDictionaries();

	if (availableDictionaries.length === 0) {
		dictionariesPath = path.join(remote.app.getAppPath(), '../dictionaries');
		availableDictionaries = [
			'en_US',
			'es_ES',
			'pt_BR'
		];
	}

	availableDictionaries = availableDictionaries.sort(function(a, b) {
		if (a > b) {
			return 1;
		}
		if (a < b) {
			return -1;
		}
		return 0;
	});

	for (var i = enabledDictionaries.length - 1; i >= 0; i--) {
		if (availableDictionaries.indexOf(enabledDictionaries[i]) === -1) {
			enabledDictionaries.splice(i, 1);
		}
	}

	if (enabledDictionaries.length === 0) {
		if (localStorage.getItem('userLanguage')) {
			let userLanguage = localStorage.getItem('userLanguage').replace('-', '_');
			if (availableDictionaries.indexOf(userLanguage) > -1) {
				enabledDictionaries.push(userLanguage);
			}
			if (userLanguage.indexOf('_') > -1) {
				userLanguage = userLanguage.split('_')[0];
				if (availableDictionaries.indexOf(userLanguage) > -1) {
					enabledDictionaries.push(userLanguage);
				}
			}
		}

		let navigatorLanguage = navigator.language.replace('-', '_');
		if (availableDictionaries.indexOf(navigatorLanguage) > -1) {
			enabledDictionaries.push(navigatorLanguage);
		}
		if (navigatorLanguage.indexOf('_') > -1) {
			navigatorLanguage = navigatorLanguage.split('_')[0];
			if (availableDictionaries.indexOf(navigatorLanguage) > -1) {
				enabledDictionaries.push(navigatorLanguage);
			}
		}
	}

	if (enabledDictionaries.length === 0) {
		let defaultLanguage = 'en_US';
		if (availableDictionaries.indexOf(defaultLanguage) > -1) {
			enabledDictionaries.push(defaultLanguage);
		}
		defaultLanguage = defaultLanguage.split('_')[0];
		if (availableDictionaries.indexOf(defaultLanguage) > -1) {
			enabledDictionaries.push(defaultLanguage);
		}
	}

	languagesMenu = {
		label: 'Spelling languages',
		submenu: []
	};

	availableDictionaries.forEach((dictionary) => {
		const menu = {
			label: dictionary,
			type: 'checkbox',
			checked: enabledDictionaries.indexOf(dictionary) > -1,
			click: function(menuItem) {
				menu.checked = menuItem.checked;
				if (menuItem.checked) {
					enabledDictionaries.push(dictionary);
				} else {
					enabledDictionaries.splice(enabledDictionaries.indexOf(dictionary), 1);
				}
				saveEnabledDictionaries();
			}
		};
		languagesMenu.submenu.push(menu);
	});

	webFrame.setSpellCheckProvider('', false, {
		spellCheck: function(text) {
			return isCorrect(text);
		}
	});
} catch(e) {
	console.log('Spellchecker module unavailable');
}

window.addEventListener('contextmenu', function(event){
	event.preventDefault();

	const template = getTemplate();

	if (languagesMenu) {
		template.unshift({ type: 'separator' });
		template.unshift(languagesMenu);
	}

	setTimeout(function() {
		if (['TEXTAREA', 'INPUT'].indexOf(event.target.nodeName) > -1) {
			const text = window.getSelection().toString().trim();
			if (text !== '' && !isCorrect(text)) {
				const options = getCorrections(text);
				const maxItems = Math.min(options.length, 6);

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

/* userPresence away timer based on system idle time */
function getSystemIdleTime() {
	return IPC.sendSync('getSystemIdleTime');
}

setInterval(function(){
	try {
		if(getSystemIdleTime() < UserPresence.awayTime) {
			UserPresence.setOnline()
		}
	} catch(e) {}
},1e3)