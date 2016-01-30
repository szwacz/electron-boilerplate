/* globals $ */

import { remote } from 'electron';
import { servers } from './servers';
import { sidebar } from './sidebar';
import { webview } from './webview';
import tray from './tray';
import './menus';

sidebar.on('badge-setted', function() {
    var badge = sidebar.getGlobalBadge();

    if (process.platform === 'darwin') {
        remote.app.dock.setBadge(badge);
    }
    tray.showTrayAlert(badge !== '', badge);
});

export var start = function() {
    var defaultInstance = 'https://demo.rocket.chat';

    // connection check
    if (!navigator.onLine) {
        offline();
    }
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);

    function online() {
        document.body.classList.remove('offline');
    }

    function offline() {
        document.body.classList.add('offline');
    }
    // end connection check

    var form = document.querySelector('form');
    var hostField = form.querySelector('[name="host"]');
    var button = form.querySelector('[type="submit"]');
    var invalidUrl = form.querySelector('#invalidUrl');

    window.addEventListener('load', function() {
        hostField.focus();
    });

    function validateHost() {
        return new Promise(function(resolve, reject) {
            var execValidation = function() {
                invalidUrl.style.display = 'none';
                hostField.classList.remove('wrong');

                var host = hostField.value.trim();
                host = host.replace(/\/$/, '');
                hostField.value = host;

                if (host.length === 0) {
                    button.value = 'Connect';
                    button.disabled = false;
                    resolve();
                    return;
                }

                button.value = 'Validating...';
                button.disabled = true;

                servers.validateHost(host, 2000).then(function() {
                    button.value = 'Connect';
                    button.disabled = false;
                    resolve();
                }, function() {
                    // If the url begins with HTTP, mark as invalid
                    if (/^http:\/\/.+/.test(host)) {
                        button.value = 'Invalid url';
                        invalidUrl.style.display = 'block';
                        hostField.classList.add('wrong');
                        reject();
                        return;
                    }

                    // If the url begins with HTTPS, fallback to HTTP
                    if (/^https:\/\/.+/.test(host)) {
                        hostField.value = host.replace('https://', 'http://');
                        return execValidation();
                    }

                    // If the url isn't localhost, don't have dots and don't have protocol
                    // try as a .rocket.chat subdomain
                    if (!/(^https?:\/\/)|(\.)|(^localhost(:\d+)?$)/.test(host)) {
                        hostField.value = `https://${host}.rocket.chat`;
                        return execValidation();
                    }

                    // If the url don't start with protocol try HTTPS
                    if (!/^https?:\/\//.test(host)) {
                        hostField.value = `https://${host}`;
                        return execValidation();
                    }
                });
            };
            execValidation();
        });
    }

    hostField.addEventListener('blur', function() {
        validateHost().then(function() {}, function() {});
    });

    var submit = function() {
        validateHost().then(function() {
            var input = form.querySelector('[name="host"]');
            var url = input.value;

            if (url.length === 0) {
                url = defaultInstance;
            }

            if (servers.addHost(url) === true) {
                sidebar.show();
            }

            servers.setActive(url);

            input.value = '';
        }, function() {});
    };

    hostField.addEventListener('keydown', function(ev) {
        if (ev.which === 13) {
            ev.preventDefault();
            ev.stopPropagation();
            submit();
            return false;
        }
    });

    form.addEventListener('submit', function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        submit();
        return false;
    });

    $('.add-server').on('click', function() {
        servers.clearActive();
    });

    servers.restoreActive();
};

window.addEventListener('focus', function() {
    webview.focusActive();
});
