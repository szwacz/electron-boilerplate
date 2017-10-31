# electron-boilerplate [![Build Status](https://travis-ci.org/szwacz/electron-boilerplate.svg?branch=master)](https://travis-ci.org/szwacz/electron-boilerplate) [![Build status](https://ci.appveyor.com/api/projects/status/s9htc1k5ojkn08fr?svg=true)](https://ci.appveyor.com/project/szwacz/electron-boilerplate)

A minimalistic yet comprehensive boilerplate application for [Electron runtime](http://electron.atom.io). Tested on macOS, Windows and Linux.  

This project does not impose on you any framework (like Angular or React). It tries to give you the 'electron' part of technology stack with the least amount of dependecies as possible. This enbables you to pick your favorite tools to build the actual app.

# Quick start

The sole development dependency of this project is [Node.js](https://nodejs.org), so make sure you have it installed.
Then type the following commands known to every Node developer...
```
git clone https://github.com/szwacz/electron-boilerplate.git
cd electron-boilerplate
npm install
npm start
```
... and boom! You have a running desktop application on your screen.

# Structure of the project

The application consists of two main folders...

`src` - files within this folder get transpiled or compiled (because Electron can't use them directly).

`app` - contains all static assets (put here images, css, html etc.) which don't need any pre-processing.

The build process compiles the content of the `src` folder and puts it into the `app` folder, so after the build has finished, your `app` folder contains the full, runnable application.

Treat `src` and `app` folders like two halves of one bigger thing.

The drawback of this design is that `app` folder contains some files which should be git-ignored and some which shouldn't (see `.gitignore` file). But thanks to this two-folders split development builds are much (much!) faster.

# Development

## Starting the app

```
npm start
```

## Upgrading Electron version

The `package.json`-file declares the Electron runtime version of your app:
```json
"devDependencies": {
  "electron": "1.6.11"
}
```
Side note: [Electron authors recommend](http://electron.atom.io/docs/tutorial/electron-versioning/) to use fixed version here.

## The build pipeline

Build process relies upon [gulp](https://github.com/gulpjs/gulp) task runner and [rollup](https://github.com/rollup/rollup) bundler. The entry-points of your code are the files `src/background.js` and `src/app.js`. Rollup will follow all `import` statements starting from those files and compile code of the whole dependency tree into one `.js` file for each entry point.

You can [add more entry points as you like](https://github.com/szwacz/electron-boilerplate/blob/master/tasks/build_app.js#L16) (e.g. to split your app into modules).

By the way, [rollup has a lot of plugins](https://github.com/rollup/rollup/wiki/Plugins). You can add them in [this file](https://github.com/szwacz/electron-boilerplate/blob/master/tasks/bundle.js#L29).

## Adding npm modules to your app

Remember to respect the split between `dependencies` and `devDependencies` in `package.json` file. Your distributable app will contain modules listed in `dependencies` after running the release script.

Side note: If the module you want to use in your app is a native one (not pure JavaScript but compiled C code or something) you should first  run `npm install name_of_npm_module --save` and then `npm run postinstall` to rebuild the module for Electron. You need to do this once after you're first time installing the module. Later on the postinstall script will fire automatically with every `npm install`.

## Working with modules

Thanks to [rollup](https://github.com/rollup/rollup) you can (and should) use ES6 modules for all code in `src` folder. But because ES6 modules still aren't natively supported you can't use them in the `app` folder.

Use ES6 syntax in the `src` folder like this:
```js
import myStuff from './my_lib/my_stuff';
```

But use CommonJS syntax in `app` folder. So the code from above should look as follows:
```js
var myStuff = require('./my_lib/my_stuff');
```

# Testing

## Unit tests

```
npm test
```

Using [electron-mocha](https://github.com/jprichardson/electron-mocha) test runner with the [chai](http://chaijs.com/api/assert/) assertion library. This task searches for all files in `src` directory which respect pattern `*.spec.js` (so you can put unit test file in the same directory as the tested file).

## End to end tests

```
npm run e2e
```

Using [mocha](https://mochajs.org/) test runner and [spectron](http://electron.atom.io/spectron/). This task searches for all files in `e2e` directory which respect pattern `*.e2e.js`.

## Code coverage

```
npm run coverage
```

Using [istanbul](http://gotwarlost.github.io/istanbul/) code coverage tool.

You can set the reporter(s) by setting `ISTANBUL_REPORTERS` environment variable (defaults to `text-summary` and `html`). `ISTANBUL_REPORT_DIR` configures the report directory and defaults to `coverage`.

## Continuous integration

Electron [is compatible with most CI Systems](https://github.com/atom/electron/blob/master/docs/tutorial/testing-on-headless-ci.md). This Boilerplate even preconfigures [Travis CI](https://travis-ci.org/) tests on macOS and Linux as well as [App Veyor](https://www.appveyor.com) tests on Windows out of the box.

# Making a release

To package your app into an installer use command:

```
npm run release
```

It will start the packaging process. One the process finished, the `dist` directory will contain your distributable file.

We use [electron-builder](https://github.com/electron-userland/electron-builder) to handle the packaging process. It has a lot of [customization options](https://github.com/electron-userland/electron-builder/wiki/Options), which you can declare under ["build" key in package.json file](https://github.com/szwacz/electron-boilerplate/blob/master/package.json#L2).

You can package your app cross-platform from a single machine [electron-builder kind of supports this](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build), but there is a lot of asterisks. That's why this the release process of this boilerplate defaults to the executing OS. You can change that of course.

# License

Released under the MIT license.
