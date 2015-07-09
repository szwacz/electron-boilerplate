(function() {
    var key = 'rocket.chat.host';

    var url = localStorage.getItem(key);
    if (url) {
        // redirect to host
        redirect(url);
    }

    document.addEventListener('ready', function() {
        var form = document.querySelector('form');
        form.addEventListener('submit', function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var input = form.querySelector('[name="host"]')
            var url = input.value;
            urlExists(url, function() {
                localStorage.setItem(key, url);
                // redirect to host
                redirect(url);
            });
            return false;
        });
    });

    function urlExists(url, callback) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url);
        http.onreadystatechange = function() {
            if (this.readyState == this.DONE) {
                callback(this.status != 404);
            }
        };
        http.send();
    }

    function redirect(url) {
        window.location.href = url;
    }

})();