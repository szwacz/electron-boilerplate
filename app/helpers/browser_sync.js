// Sets up the BrowserSync client script
// (but, only when run through gulp)

(function () {
    'use strict';

    // Gulp should have provided us with a client script URL
    if (process.env.BROWSER_SYNC_CLIENT_URL) {

        // Load the BrowserSync client Script
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = process.env.BROWSER_SYNC_CLIENT_URL;
        script.async = true;
        head.appendChild(script);
    }

}());
