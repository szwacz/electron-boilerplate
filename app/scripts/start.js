/* globals $ */

import { remote } from 'electron';
import { servers } from './servers';
import { sidebar } from './sidebar';
import tray from './tray';
import './menus';

export var start = function() {
    var defaultInstance = 'https://demo.rocket.chat';

    //init loader
    var loader = document.querySelector('.loader');
    if (loader) {
        var src = loader.getAttribute('data-src');
        var http = new XMLHttpRequest();
        http.open('GET', src);
        http.onreadystatechange = function() {
            if (this.readyState === this.DONE) {
                if (this.response) {
                    loader.innerHTML = this.response + loader.innerHTML;
                }
            }
        };
        http.send();
    }

    function loadPreviousHost() {
        var current = servers.active;
        if (current) {
            loadServer(current);
        }
    }

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
                    if (!/(^https?:\/\/)|(\.)|(^localhost(:d+)?$)/.test(host)) {
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
                connectDefaultInstance();
            } else {
                addServer(url);
                redirect(url);
                input.value = '';
            }
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

    function addServer(url) {
        if (servers.hostExists(url)) {
            loadServer(url);
            return;
        }

        if (servers.addHost(url) === false) {
            return;
        }

        document.body.classList.remove('hide-server-list');
        localStorage.setItem('server-list-closed', 'false');

        sidebar.setActive(url);
    }

    $('.add-server').on('click', function() {
        document.querySelector('.rocket-app').style.display = 'none';
        document.querySelector('.landing-page').style.display = null;
        var activeItem = document.querySelector('.server-list li.active');
        servers.clearActive();
        if (activeItem) {
            activeItem.classList.remove('active');
        }
    });

    function renderServers() {
        var hosts = servers.hosts;

        for (var host in hosts) {
            if (hosts.hasOwnProperty(host)) {
                createWebview(hosts[host].url);
            }
        }
    }

    renderServers();
    loadPreviousHost();

    if (localStorage.getItem('server-list-closed') === 'false') {
        document.body.classList.remove('hide-server-list');
    }

    sidebar.on('click', function(hostUrl) {
        loadServer(hostUrl);
    });

    function loadServer(hostUrl) {
        sidebar.setActive(hostUrl);
        redirect(hostUrl);
    }

    function createWebview(url) {
        var webview = document.querySelector(`webview[server="${url}"]`);
        if (webview) {
            return webview;
        }

        webview = document.createElement('webview');
        webview.setAttribute('server', url);
        webview.setAttribute('preload', './scripts/preload.js');
        webview.setAttribute('allowpopups', 'on');
        webview.setAttribute('disablewebsecurity', 'on');

        // webview.addEventListener('did-start-loading', function() {
        //     console.log('did-start-loading');
        // });
        // webview.addEventListener('did-stop-loading', function() {
        //     console.log('did-stop-loading');
        // });
        webview.addEventListener('did-navigate-in-page', function(lastPath) {
            var hosts = servers.hosts;
            hosts[url].lastPath = lastPath.url;
            servers.hosts = hosts;
        });
        webview.addEventListener('console-message', function(e) {
            console.log('webview:', e.message);
        });
        webview.addEventListener('ipc-message', function(event) {
            window.dispatchEvent(new CustomEvent(event.channel, {
               detail: event.args[0]
            }));

            switch (event.channel) {
                case 'title-changed':
                    var hosts = servers.hosts;
                    var title = event.args[0];
                    if (title === 'Rocket.Chat' && /https?:\/\/demo\.rocket\.chat/.test(url) === false) {
                        title += ' - ' + url;
                    }
                    hosts[url].title = title;
                    servers.hosts = hosts;
                    $(`li[server="${url}"] .tootip`).html(title);
                    break;
                case 'unread-changed':
                    var unread = event.args[0];
                    var showAlert = (unread !== null && unread !== undefined && unread !== '');
                    if (showAlert) {
                        $(`li[server="${url}"]`).addClass('unread');
                        $(`li[server="${url}"] .badge`).html(unread);
                    } else {
                        $(`li[server="${url}"]`).removeClass('unread');
                        $(`li[server="${url}"] .badge`).html('');
                    }

                    var count = 0;
                    var alert = false;
                    $(`li.instance .badge`).each(function(index, item) {
                        var text = $(item).html();
                        if (!isNaN(parseInt(text))) {
                            count += parseInt(text);
                        }
                        if (!alert) {
                            alert = text === '•';
                        }
                    });

                    if (count > 0) {
                        if (process.platform === 'darwin') {
                            remote.app.dock.setBadge(String(count));
                        }
                        tray.showTrayAlert(true, String(count));
                    } else if (alert === true) {
                        if (process.platform === 'darwin') {
                            remote.app.dock.setBadge('•');
                        }
                        tray.showTrayAlert(true, '');
                    } else {
                        if (process.platform === 'darwin') {
                            remote.app.dock.setBadge('');
                        }
                        tray.showTrayAlert(false, '');
                    }
                    break;
            }
        });
        document.querySelector('.rocket-app').appendChild(webview);
        var hosts = servers.hosts;
        if (hosts[url].lastPath) {
            webview.src = hosts[url].lastPath;
        } else {
            webview.src = url;
        }

        return webview;
    }

    function redirect(url) {
        servers.setActive(url);
        var webview = createWebview(url);
        webview.classList.add('active');

        $(`webview:not([server="${url}"])`).removeClass('active');

        document.querySelector('.landing-page').style.display = 'none';
        document.querySelector('.rocket-app').style.display = 'block';
    }

    function connectDefaultInstance() {
        addServer(defaultInstance);
        redirect(defaultInstance);
    }

};
