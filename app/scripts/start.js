/* globals $ */

import { remote } from 'electron';
import { servers } from './servers';

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
        var current = localStorage.getItem('rocket.chat.currentHost');
        if (current) {
            var item = getInstanceButtonByURL(current);
            if (item) {
                loadServer(item);
            }
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
                    if (!/(^https?:\/\/)|(\.)|(^localhost$)/.test(host)) {
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
            console.log(url);

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
            var item = getInstanceButtonByURL(url);
            if (item) {
                loadServer(item);
            }
            return;
        }

        if (servers.addHost(url) === false) {
            return;
        }

        var list = document.getElementById('serverList');

        document.body.classList.remove('hide-server-list');
        localStorage.setItem('server-list-closed', 'false');

        clearActive();

        var lastLi = document.querySelector('#serverList .add-server');
        list.insertBefore(createItem(servers.hosts[url], true), lastLi);
    }

    $('.add-server').on('click', function() {
        document.querySelector('.rocket-app').style.display = 'none';
        document.querySelector('.landing-page').style.display = null;
        var activeItem = document.querySelector('.server-list li.active');
        localStorage.removeItem('rocket.chat.currentHost');
        if (activeItem) {
            activeItem.classList.remove('active');
        }
    });

    function getInstanceButtonByURL(url) {
        return document.querySelector(`#serverList .instance[server="${url}"]`);
    }

    function createItem(host, active) {
        var url = host.url;
        var name = host.title.replace(/^https?:\/\/(?:www\.)?([^\/]+)(.*)/, '$1');
        name = name.split('.');
        name = name[0][0] + (name[1] ? name[1][0] : '');
        name = name.toUpperCase();

        var item = document.createElement('li');

        var initials = document.createElement('span');
        initials.innerHTML = name;

        var tooltip = document.createElement('div');
        tooltip.innerHTML = host.title;

        item.appendChild(initials);
        item.appendChild(tooltip);

        var img = document.createElement('img');
        img.onload = function() {
            img.style.display = 'initial';
            initials.style.display = 'none';
        };
        img.src = `${url}/assets/favicon.svg?v=3`;
        item.appendChild(img);
        item.dataset.host = url;
        item.setAttribute('server', url);
        item.classList.add('instance');
        if (active) {
            item.classList.add('active');
        }
        item.onclick = function() {
            loadServer(this);
        };
        return item;
    }

    function clearActive() {
        var activeItem = document.querySelector('.server-list li.active');
        if (activeItem) {
            activeItem.classList.remove('active');
        }
    }

    function renderServers() {
        var list = document.getElementById('serverList');
        var lastLi = document.querySelector('#serverList .add-server');
        var hosts = servers.hosts;

        for (var host in hosts) {
            if (hosts.hasOwnProperty(host)) {
                list.insertBefore(createItem(hosts[host]), lastLi);
            }
        }
    }

    renderServers();
    loadPreviousHost();

    if (localStorage.getItem('server-list-closed') === 'false') {
        document.body.classList.remove('hide-server-list');
    }

    function loadServer(el) {
        if (!el.classList.contains('active')) {
            clearActive();

            el.classList.add('active');
            redirect(el.dataset.host);
        }
    }

    function redirect(url) {
        localStorage.setItem('rocket.chat.currentHost', url);
        var webview = document.querySelector(`webview[server="${url}"]`);
        if (!webview) {
            webview = document.createElement('webview');
            webview.setAttribute('server', url);
            webview.setAttribute('preload', './preload.js');
            webview.setAttribute('allowpopups', 'on');

            // webview.addEventListener('did-start-loading', function() {
            //     console.log('did-start-loading');
            // });
            // webview.addEventListener('did-stop-loading', function() {
            //     console.log('did-stop-loading');
            // });
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
                        $(`li[server="${url}"] div`).html(title);
                        break;
                }
            });
            document.querySelector('.rocket-app').appendChild(webview);
            webview.src = url;
        } else {
            webview.style.display = 'initial';
        }

        $(`webview:not([server="${url}"])`).css('display', 'none');

        document.querySelector('.landing-page').style.display = 'none';
        document.querySelector('.rocket-app').style.display = 'block';
    }

    function connectDefaultInstance() {
        addServer(defaultInstance);
        redirect(defaultInstance);
    }

    window.addEventListener('unread-changed', function(event) {
        var unread = event.detail;
        // let showAlert = (unread !== null && unread !== undefined && unread !== '');
        if (process.platform === 'darwin') {
            remote.app.dock.setBadge(String(unread || ''));
        }
        // remote.Tray.showTrayAlert(showAlert, String(unread));
    });
};
