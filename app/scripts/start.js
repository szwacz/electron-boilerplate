(function() {
    var key = 'rocket.chat.host';

    var url = localStorage.getItem(key);
    if (url) {
        // redirect to host
        redirect(url);
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
        window.location.href = url;
    }

})();
