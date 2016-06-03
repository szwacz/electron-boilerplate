// Simple module exposing environment variables to rest of the code.

import jetpack from 'fs-jetpack';

// Normal way of obtaining env variables: They are written to package.json file.
var env;
var app;
if (process.type === 'renderer') {
    app = require('electron').remote.app;
} else {
    app = require('electron').app;
}
var appDir = jetpack.cwd(app.getAppPath());
var manifest = appDir.read('package.json', 'json');

if (manifest && manifest.env) {
    env = manifest.env;
} else {
    // If 'normal way' failed, assume we're in test environment (where normal
    // way won't work) and grab the variables in a ditry way.
    env = jetpack.cwd(__dirname).read('../config/env_test.json', 'json');
}

export default env;
