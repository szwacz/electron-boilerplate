electron-boilerplate
==============
Comprehensive boilerplate application for [Electron runtime](http://electron.atom.io).  

Scope of this project:

- Provide basic structure of the application so you can much easier grasp what should go where.
- Give you cross-platform development environment, which works the same way on OSX, Windows and Linux.
- Generate ready for distribution installers of your app for all supported operating systems.

NOT in the scope:

- Imposing on you any framework (e.g. Angular, React). You can integrate the one which makes most sense for you.

By the way, there is a twin project to this one: [nw-boilerplate](https://github.com/szwacz/nw-boilerplate), which is the same thing but for NW.js.

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
  "electron-prebuilt": "^0.24.0"
}
```

#### 2. For your application
Sits on path: `electron-boilerplate/app/package.json`. This is **real** manifest of your application. Declare your app dependencies here.

#### OMG, but seriously why there are two `package.json`?
1. Native npm modules (those written in C, not JavaScript) need to be compiled, and here we have two different compilation targets for them. Those used in application need to be compiled against electron runtime, and all `devDependencies` need to be compiled against your locally installed node.js. Thanks to having two files this is trivial.
2. When you package the app for distribution there is no need to add up to size of the app with your `devDependencies`. Here those are always not included (because reside outside the `app` directory).

### Project's folders

- `app` - code of your application goes here.
- `config` - place for you to declare environment specific stuff.
- `build` - in this folder lands built, runnable application.
- `releases` - ready for distribution installers will land here.
- `resources` - resources for particular operating system.
- `tasks` - build and development environment scripts.


# Development

#### Installation

```
npm install
```
It will also download Electron runtime, and install dependencies for second `package.json` file inside `app` folder.

#### Starting the app

```
npm start
```

#### Adding pure-js npm modules to your app

Remember to add your dependency to `app/package.json` file, so do:
```
cd app
npm install name_of_npm_module --save
```

#### Adding native npm modules to your app

If you want to install native module you need to compile it agains Electron, not Node.js you are firing in command line by typing `npm install` [(Read more)](https://github.com/atom/electron/blob/master/docs/tutorial/using-native-node-modules.md).
```
npm run app-install -- name_of_npm_module
```
Of course this method works also for pure-js modules, so you can use it all the time if you're able to remember such an ugly command.

#### Working with modules

Electron ecosystem (because it's a merge of node.js and browser) gives you a little trouble while working with modules. ES6 modules have nice syntax and are the future, so they're utilized in this project (thanks to [rollup](https://github.com/rollup/rollup)). But at the same time node.js and npm still rely on the CommonJS syntax. So in this project you need to use both:
```js
// Modules which you authored in this project are intended to be
// imported through new ES6 syntax.
import { myStuff } from './my_lib/my_stuff';

// Node.js modules are loaded the old way with require().
var fs = require('fs');

// And all modules which you installed from npm
// also need to be required.
var moment = require('moment');
```

#### Unit tests

electron-boilerplate has preconfigured [jasmine](http://jasmine.github.io/2.0/introduction.html) unit test runner. To run it go with standard:
```
npm test
```
You don't have to declare paths to spec files in any particular place. The runner will search through the project for all `*.spec.js` files and include them automatically.


# Making a release

**Note:** There are various icon and bitmap files in `resources` directory. Those are used in installers and are intended to be replaced by your own graphics.

To make ready for distribution installer use command:
```
npm run release
```
It will start the packaging process for operating system you are running this command on. Ready for distribution file will be outputted to `releases` directory.

You can create Windows installer only when running on Windows, the same is true for Linux and OSX. So to generate all three installers you need all three operating systems.

## Mac only

#### App signing

The Mac release supports [code signing](https://developer.apple.com/library/mac/documentation/Security/Conceptual/CodeSigningGuide/Procedures/Procedures.html). To sign the `.app` in the release image, include the certificate ID in the command as so,
```
npm run release -- --sign A123456789
```

## Windows only

#### Installer

The installer is built using [NSIS](http://nsis.sourceforge.net). You have to install NSIS version 3.0, and add its folder to PATH in Environment Variables, so it is reachable to scripts in this project. For example, `C:\Program Files (x86)\NSIS`.

#### 32-bit build on 64-bit Windows

There are still a lot of 32-bit Windows installations in use. If you want to support those systems and have 64-bit OS make sure you've installed 32-bit (instead of 64-bit) Node version. There are [versions managers](https://github.com/coreybutler/nvm-windows) if you feel the need for both architectures on the same machine.

# License

The MIT License (MIT)

Copyright (c) 2015 Jakub Szwacz

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
