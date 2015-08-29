(function() {
    var key = 'rocket.chat.hosts',
        rocketHeader = 'X-Rocket-Chat-Version'.toLowerCase(),
        defaultInstance = 'https://demo.rocket.chat/';

    //init loader
    var loader = document.querySelector('.loader');
    if (loader) {
        var src = loader.getAttribute('data-src');
        var http = new XMLHttpRequest();
        http.open('GET', src);
        http.onreadystatechange = function() {
            if (this.readyState == this.DONE) {
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
    if (!navigator.onLine) offline();
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
        console.log('trying to connect')
        ev.preventDefault();
        ev.stopPropagation();
        var input = form.querySelector('[name="host"]');
        var button = form.querySelector('[type="submit"]');
        var val = button.value;
        button.value = button.getAttribute('data-loading-text');
        var url = input.value;

        if (url.length === 0) {
            connectDefaultInstance();
            input.value = '';
            button.value = val;
        } else {

            console.debug('checking', url);
            input.classList.remove('wrong');
            urlExists(url, 5000).then(function() {
                console.debug('url found!');
                addServer(url);
                redirect(url);
                input.value = '';
                button.value = val;
            }, function(status) {
                button.value = val;
                form.querySelector('#invalidUrl').style.display = 'block';
                console.debug('url wrong');
                input.classList.add('wrong');
            });
        }

        return false;
    });

    function changeServer() {
        document.querySelector('.rocket-app').style.display = 'none';
        document.querySelector('.landing-page').style.display = 'block';
    }

    function urlExists(url, timeout) {
        return new Promise(function(resolve, reject) {
            var http = new XMLHttpRequest();
            var resolved = false;
            http.open('HEAD', url);
            http.onreadystatechange = function() {
                if (this.readyState == this.DONE) {
                    if (!resolved) {
                        resolved = true;
                        var headers = this.getAllResponseHeaders().toLowerCase();
                        if (headers.indexOf(rocketHeader) !== -1) {
                            resolve();
                        } else {
                            reject(this.status);
                        }
                    }
                }
            };
            if (timeout) {
                setTimeout(function() {
                    if (!resolved) {
                        resolved = true;
                        reject();
                    }
                }, timeout);
            }
            http.send();
        });
    }

    function addServer(url) {
        var hosts = localStorage.getItem(key);
        if (hosts === null) {
            hosts = [];
        } else {
            try {
                hosts = JSON.parse(hosts);
            } catch (e) {}
        }

        var list = document.getElementById('serverList');

        var newHost = true;
        hosts.some(function(instanceURL) {
            if (instanceURL === url) {
                var item = getInstanceButtonByURL(url);
                if (item) {
                    loadServer(item);
                }

                newHost = false;
                return true;
            }
        });

        if (!newHost) {
            return;
        }

        hosts.push(url);
        localStorage.setItem(key, JSON.stringify(hosts));

        clearActive();

        list.appendChild(createItem(url, (list.childNodes.length + 1), true));
    }

    function getInstanceButtonByURL(url) {
        var list = document.getElementById('serverList');
        for (var i = 0; i < list.childNodes.length; i++) {
            if (list.childNodes[i].dataset.host === url) {
                return list.childNodes[i];
            }
        }
    }

    function createItem(url, pos, active) {
        var item = document.createElement('li');
        item.innerHTML = '<span>' + (pos) + '</span>';
        item.dataset.host = url;
        item.title = url;
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
        var hosts = localStorage.getItem(key);

        try {
            hosts = JSON.parse(hosts);
        } catch (e) {
            if (hosts.match(/^https?:\/\//)) {
                hosts = [hosts];
            }

            localStorage.setItem(key, JSON.stringify(hosts));
        }

        if(hosts) {
            for (var i = 0; i < hosts.length; i++) {
                list.appendChild(createItem(hosts[i], (i + 1)));
            }
        }
    }

    renderServers();
    loadPreviousHost();

    function loadServer(el) {
        if (!el.classList.contains('active')) {
            clearActive();

            el.classList.add('active');
            redirect(el.dataset.host);
        }
    }

    function redirect(url) {
        localStorage.setItem('rocket.chat.currentHost', url);
        document.getElementById('rocketAppFrame').src = url;
        document.querySelector('.landing-page').style.display = 'none';
        document.querySelector('.rocket-app').style.display = 'block';
    }

    function connectDefaultInstance() {
        addServer(defaultInstance);
        redirect(defaultInstance);
    }

    var rocketAppFrame = document.getElementById('rocketAppFrame');
    rocketAppFrame.onload = function () {
        rocketAppFrame.contentWindow.addEventListener('unread-changed', function (e) {
            window.dispatchEvent(new CustomEvent('unread-changed', {
                detail: e.detail
            }));
        });
        rocketAppFrame.contentWindow.document.addEventListener('click', supportExternalLinks, false);
        rocketAppFrame.contentWindow.open = function() {
            return window.open.apply(this, arguments);
        }
    };
})();
