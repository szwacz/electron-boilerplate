(function() {
    var key = 'rocket.chat.host';

    //init loader
    var loader = document.querySelector('.loader');
    if (loader) {
        var src = loader.getAttribute('data-src');
        var http = new XMLHttpRequest();
        http.open('GET', src);
        http.onreadystatechange = function() {
            if (this.readyState == this.DONE) {
                if (this.response) {
                    loader.innerHTML = this.response;
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

    var form = document.querySelector('form');
    form.addEventListener('submit', function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var input = form.querySelector('[name="host"]');
        var button = form.querySelector('[type="submit"]');
        var val = button.value;
        button.value = button.getAttribute('data-loading-text');
        var url = input.value;
        console.debug('checking', url);
        input.classList.remove('wrong');
        urlExists(url, function(check) {
            if (check) {
                console.debug('url found!');
                localStorage.setItem(key, url);
                document.body.classList.add('connecting');
                // redirect to host
                redirect(url);
            } else {
                button.value = val;
                console.debug('url wrong');
                input.classList.add('wrong');
            }
        });
        return false;
    });

    function urlExists(url, callback) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url);
        http.onreadystatechange = function() {
            if (this.readyState == this.DONE) {
                callback(this.status != 404 && this.status != 0);
            }
        };
        http.send();
    }

    function redirect(url) {
        window.open(url, '_blank');
    }

})();
