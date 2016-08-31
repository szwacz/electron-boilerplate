electron-boilerplate
==============
Minimalistic yet comprehensive boilerplate application for [Electron runtime](http://electron.atom.io).  

Provides cross-platform development environment, which works the same way on OSX, Windows and Linux, and allows you to generate ready for distribution installers of your app for those operating systems.

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

## Declaring dependencies

There are **two** `package.json` files:

#### 1. `package.json` for development
Sits on path: `electron-boilerplate/package.json`. Here you declare dependencies for your development environment and build scripts. **This file is not distributed with real application!**

Also here you declare the version of Electron runtime you want to use:
```json
"devDependencies": {
  "electron": "1.3.3"
}
```
Note: [Electron authors advise](http://electron.atom.io/docs/tutorial/electron-versioning/) to use fixed version here.

#### 2. `package.json` for your application
Sits on path: `electron-boilerplate/app/package.json`. This is **real** manifest of your application. Declare your app dependencies here.

#### OMG, but seriously why there are two `package.json`?
1. Native npm modules (those written in C, not JavaScript) need to be compiled, and here we have two different compilation targets for them. Those used in application need to be compiled against electron runtime, and all `devDependencies` need to be compiled against your locally installed node.js. Thanks to having two files this is trivial.
2. When you package the app for distribution there is no need to add up to size of the app with your `devDependencies`. Here those are always not included (reside outside the `app` directory).

## Folders

The application is split between two main folders...

`src` - this folder is intended for files which need to be transpiled or compiled (files which can't be used directly by electron).

`app` - contains all static assets (put here images, css, html etc.) which don't need any pre-processing.

Build process compiles all stuff from `src` folder and puts it into `app` folder, so after build finished `app` contains full, runnable application.

Treat `src` and `app` folders like two halves of one bigger thing.

Drawback of this design is that `app` folder contains some files which should be git-ignored and some which should not (see `.gitignore` file). But thanks to this split development builds are much much faster.

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

Thanks to [rollup](https://github.com/rollup/rollup) you can (and should) use ES6 modules for all code in `src` folder. But because ES6 modules still aren't natively supported you can't use it in `app` folder.

So for file in `src` folder do this:
```js
import myStuff from './my_lib/my_stuff';
```

But in file in `app` folder the same line must look as follows:
```js
var myStuff = require('./my_lib/my_stuff');
```

# Testing

electron-boilerplate has preconfigured test environments...

### Unit tests

Using [electron-mocha](https://github.com/jprichardson/electron-mocha) test runner with the [chai](http://chaijs.com/api/assert/) assertion library. To run the tests go with standard:
```
npm test
```
Test task searches for all files in `src` directory which respect pattern `*.spec.js`.

Those tests can be plugged into [continuous integration system](https://github.com/atom/electron/blob/master/docs/tutorial/testing-on-headless-ci.md).

### End to end tests

Using [mocha](https://mochajs.org/) test runner and [spectron](http://electron.atom.io/spectron/). Run with command:
```
npm run e2e
```
The task searches for all files in `e2e` directory which respect pattern `*.e2e.js`.

# Making a release

**Note:** There are various icon and bitmap files in `resources` directory. Those are used in installers and are intended to be replaced by your own graphics.

To make ready for distribution installer use command:
```
npm run release
```
It will start the packaging process for operating system you are running this command on. Ready for distribution file will be outputted to `dist` directory.

You can create Windows installer only when running on Windows, the same is true for Linux and OSX. So to generate all three installers you need all three operating systems.

All packaging actions are handled by [electron-builder](https://github.com/electron-userland/electron-builder). See docs of this tool if you want to customize something.

# License

Released under the MIT license.
