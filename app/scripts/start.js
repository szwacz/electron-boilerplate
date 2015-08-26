(function() {
    var key = 'rocket.chat.host',
        rocketHeader = 'X-Rocket-Chat-Version'.toLowerCase(),
        defaultInstance = 'https://demo.rocket.chat/';

    if (/clearcache=true/.test(location.search)) {
        localStorage.removeItem(key);
    }

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

    var url = localStorage.getItem(key);
    console.debug(url);
    if (url) {
        document.body.classList.add('connecting');
        // redirect to host
        redirect(url);
        return;
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
            button.value = val;
            form.querySelector('#defaultInstance').style.display = 'block';
            form.querySelector('#connectDefaultInstance').onclick = connectDefaultInstance;
        } else {

            console.debug('checking', url);
            input.classList.remove('wrong');
            urlExists(url, 5000).then(function() {
                console.debug('url found!');
                localStorage.setItem(key, url);
                document.body.classList.add('connecting');
                // redirect to host
                redirect(url);
            }, function(status) {
                button.value = val;
                form.querySelector('#invalidUrl').style.display = 'block';
                console.debug('url wrong');
                input.classList.add('wrong');
            });
        }

        return false;
    });

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

    function redirect(url) {
        window.location = url;
    }

    function connectDefaultInstance() {
        document.body.classList.add('connecting');

        form.querySelector('#defaultInstance').style.display = 'none';
        localStorage.setItem(key, defaultInstance);

        redirect(defaultInstance);

    }

})();
