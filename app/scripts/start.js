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
    form.addEventListener('submit', function(ev) {
        console.log('trying to connect');
        ev.preventDefault();
        ev.stopPropagation();
        var input = form.querySelector('[name="host"]');
        var button = form.querySelector('[type="submit"]');
        var val = button.value;
        button.value = button.getAttribute('data-loading-text');
        var url = input.value;
        url = url.replace(/\/$/, '');

        if (url.length === 0) {
            connectDefaultInstance();
            input.value = '';
            button.value = val;
        } else {

            console.debug('checking', url);
            input.classList.remove('wrong');
            servers.validateHost(url, 5000).then(function() {
                console.debug('url found!');
                addServer(url);
                redirect(url);
                input.value = '';
                button.value = val;
            }, function(/*status*/) {
                button.value = val;
                form.querySelector('#invalidUrl').style.display = 'block';
                console.debug('url wrong');
                input.classList.add('wrong');
            });
        }

        return false;
    });

    // function changeServer() {
    //     document.querySelector('.rocket-app').style.display = 'none';
    //     document.querySelector('.landing-page').style.display = 'block';
    // }

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
        list.insertBefore(createItem(url, (list.childNodes.length + 1), true), lastLi);
    }

    $('.add-server').on('click', function() {
        document.querySelector('.rocket-app').style.display = 'none';
        document.querySelector('.landing-page').style.display = 'block';
        var activeItem = document.querySelector('.server-list li.active');
        localStorage.removeItem('rocket.chat.currentHost');
        if (activeItem) {
            activeItem.classList.remove('active');
        }
    });

    function getInstanceButtonByURL(url) {
        return document.querySelector(`#serverList .instance[server="${url}"]`);
    }

    function createItem(url, pos, active) {
        var name = url.replace(/^https?:\/\/(?:www\.)?([^\/]+)(.*)/, '$1');
        name = name.split('.');
        name = name[0][0] + (name[1] ? name[1][0] : '');
        name = name.toUpperCase();

        var item = document.createElement('li');

        var initials = document.createElement('span');
        initials.innerHTML = name;

        var tooltip = document.createElement('div');
        tooltip.innerHTML = url;

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

        for (var i = 0; i < hosts.length; i++) {
            list.insertBefore(createItem(hosts[i], (i + 1)), lastLi);
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
