// Simple wrapper exposing environment variables to rest of the code.

import jetpack from 'fs-jetpack';

// The variables have been written to `env.json` by the build process.
const env = jetpack.cwd(__dirname).read('env.json', 'json');

export default env;
