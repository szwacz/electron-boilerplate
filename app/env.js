// Simple module exposes environment variables to rest of the code.

import jetpack from 'fs-jetpack';

let env;

if (process.env.NODE_ENV === 'test') {
    // For test environment 'normal way' won't work, so grab the variables directly.
    env = jetpack.cwd(__dirname).read('../config/env_test.json', 'json');
} else {
    // Normal way of obtaining env variables: They are written to package.json file.
    let app;
    if (process.type === 'renderer') {
        app = require('electron').remote.app;
    } else {
        app = require('electron').app;
    }
    let appDir = jetpack.cwd(app.getAppPath());
    env = appDir.read('package.json', 'json').env;
}

export default env;
