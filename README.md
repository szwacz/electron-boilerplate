electron-boilerplate
==============
Minimalistic yet comprehensive boilerplate application for [Electron runtime](http://electron.atom.io).  

Provides cross-platform development environment, which works the same way on OSX, Windows and Linux, and allows you to generate ready for distribution installers of your app for those three operating systems.

At the same time this boilerplate does not impose on you any framework (like Angular or React). Tries to give you only the 'electron' part of technology stack so you can pick your favorite tools for 'the actual app' part.

# Quick start
The only development dependency of this project is [Node.js](https://nodejs.org). So just make sure you have it installed.
Then type few commands known to every Node developer...
```
git clone https://github.com/szwacz/electron-boilerplate.git
cd electron-boilerplate
npm install
npm start
```
... and boom! You have running desktop application on your screen.

# Structure of the project

There are **two** `package.json` files:  

#### 1. For development
Sits on path: `electron-boilerplate/package.json`. Here you declare dependencies for your development environment and build scripts. **This file is not distributed with real application!**

Also here you declare the version of Electron runtime you want to use:
```json
"devDependencies": {
  "electron-prebuilt": "^1.2.0"
}
```

#### 2. For your application
Sits on path: `electron-boilerplate/app/package.json`. This is **real** manifest of your application. Declare your app dependencies here.

#### OMG, but seriously why there are two `package.json`?
1. Native npm modules (those written in C, not JavaScript) need to be compiled, and here we have two different compilation targets for them. Those used in application need to be compiled against electron runtime, and all `devDependencies` need to be compiled against your locally installed node.js. Thanks to having two files this is trivial.
2. When you package the app for distribution there is no need to add up to size of the app with your `devDependencies`. Here those are always not included (because reside outside the `app` directory).

# Development

### Installation

```
npm install
```
It will also download Electron runtime, and install dependencies for second `package.json` file inside `app` folder.

### Starting the app

```
npm start
```

### Adding npm modules to your app

Remember to add your dependency to `app/package.json` file, so do:
```
cd app
npm install name_of_npm_module --save
```

### Working with modules

How about being future proof and using ES6 modules everywhere in your app? Thanks to [rollup](https://github.com/rollup/rollup) you can do that. It will transpile the imports to proper `require()` statements, so even though ES6 modules aren't natively supported yet you can start using them today.

You can use it on those kinds of modules:
```js
// Modules authored by you
import { myStuff } from './my_lib/my_stuff';
// Node.js native
import fs from 'fs';
// Electron native
import { app } from 'electron';
// Loaded from npm
import moment from 'moment';
```

### Including files to your project

The build script copies files from `app` to `build` directory and the application is started from `build`. Therefore if you want to use any special file/folder in your app make sure it will be copied via some of glob patterns in `tasks/build/build.js`:

```js
var paths = {
    copyFromAppDir: [
        './node_modules/**',
        './vendor/**',
        './**/*.html',
        './**/*.+(jpg|png|svg)'
    ],
}
```

## Unit tests

electron-boilerplate has preconfigured [mocha](https://mochajs.org/) test runner with the [chai](http://chaijs.com/api/assert/) assertion library. To run the tests go with standard:
```
npm test
```
You don't have to declare paths to spec files in any particular place. The runner will search through the project for all `*.spec.js` files and include them automatically.

Those tests can be plugged into [continuous integration system](https://github.com/atom/electron/blob/master/docs/tutorial/testing-on-headless-ci.md).

# Making a release

**Note:** There are various icon and bitmap files in `resources` directory. Those are used in installers and are intended to be replaced by your own graphics.

To make ready for distribution installer use command:
```
npm run release
```
It will start the packaging process for operating system you are running this command on. Ready for distribution file will be outputted to `dist` directory.

You can create Windows installer only when running on Windows, the same is true for Linux and OSX. So to generate all three installers you need all three operating systems.

All packaging actions are handled by [electron-builder](https://github.com/electron-userland/electron-builder) module. See docs of that tool if you want to customize something or just see what's available.

# License

The MIT License (MIT)

Copyright (c) 2015-2016 Jakub Szwacz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
