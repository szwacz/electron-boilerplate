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
