/* globals Meteor, Tracker, RocketChat */

var IPC = require('electron').ipcRenderer;

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
var checker = require('spellchecker');
var remote = require('remote');
var webContents = remote.getCurrentWebContents();
var Menu = remote.require('menu');
var menu = new Menu();

// set the initial context menu so that a context menu exists even before spellcheck is called
var getTemplate = function() {
    return [
        {
            label: 'Undo',
            selector: 'undo:'
        },
        {
            label: 'Redo',
            selector: 'redo:'
        },
        {
            type: 'separator'
        },
        {
            label: 'Cut',
            selector: 'cut:'
        },
        {
            label: 'Copy',
            selector: 'copy:'
        },
        {
            label: 'Paste',
            selector: 'paste:'
        },
        {
            label: 'Select All',
            selector: 'selectAll:'
        }
    ];
};

var template = getTemplate();
menu = Menu.buildFromTemplate(getTemplate());

webFrame.setSpellCheckProvider((localStorage.getItem('userLanguage') || 'en'), false, {
    spellCheck: function(text) {
        if (localStorage.getItem('userLanguage')) {
            checker.setDictionary(localStorage.getItem('userLanguage'));
        }

        var isMisspelled = checker.isMisspelled(text);

        if (isMisspelled) {
            var options = checker.getCorrectionsForMisspelling(text);
            var maxItems = Math.min(options.length, 5);
            template.unshift({type: 'separator'});
            if (maxItems > 0) {
                var onClick = function(menuItem) {
                    webContents.replaceMisspelling(menuItem.label);
                };
                for (var i = maxItems-1; i >= 0; i--) {
                    var item = options[i];
                    template.unshift({ label: item, click: onClick});
                }
            } else {
                template.unshift({ label: 'no suggestions', click: function() { } });
            }
        }
        menu = Menu.buildFromTemplate(template);
        template = getTemplate();

        return !isMisspelled;
    }
});

window.addEventListener('contextmenu', function(){
    menu.popup(remote.getCurrentWindow());
    menu = Menu.buildFromTemplate(template);
}, false);
