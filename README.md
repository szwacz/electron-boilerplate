Rocket.Chat.Electron
==============

All of Rocket.Chat's Desktop Apps - for Windows, Mac OSX, and Linux are based on the [Elecctron platform from GitHub](https://github.com/electron/electron).   This is the source code base for all desktop apps.

### IMPORTANT

Please join the community server channel for Rocket.Chat Electron app users for feedback, interactions, and important notification regarding this code:

https://demo.rocket.chat/channel/electronapps


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

# Structure of the project

There are **two** `package.json` files:

#### 1. For development
Sits at root of the application. Just used for development dependencies. **This file is not distributed with real application!**


#### 2. For your application
Sits on path: `app/package.json`. This is **real** manifest of your application. App dependencies declared here.

### Project's folders

- `app` - code of your application goes here.
- `config` - place where you can declare environment specific stuff for your app.
- `build` - in this folder lands built, runnable application.
- `releases` - ready for distribution installers will land here.
- `resources` - resources needed for particular operating system.
- `tasks` - build and development environment scripts.

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
```shell
npm run release -- --sign DX85ENM22A
```

#### Mac App Store
You should install the Electron build for MAS
```
export npm_config_platform=mas
rm -rf node_modules
npm install
```

To sign your app for Mac App Store
```shell
npm run release -- --mas --mas-sign "3rd Party Mac Developer Application: Company Name (APPIDENTITY)" --mas-installer-sign "3rd Party Mac Developer Installer: Company Name (APPIDENTITY)"
```

Or edit the `app/package.json`, remove the `//` from `//codeSignIdentitiy` and update the values with your sign indentities
```json
  "//codeSignIdentitiy": {
    "dmg": "Developer ID Application: Company Name (APPIDENTITY)",
    "MAS": "3rd Party Mac Developer Application: Company Name (APPIDENTITY)",
    "MASInstaller": "3rd Party Mac Developer Installer: Company Name (APPIDENTITY)"
  }
```

You can change the application category too
```json
  "LSApplicationCategoryType": "public.app-category.productivity"
```

If you insert your indentities in the package.json you can compile for MAS like
```
npm run release -- --mas
```

## Windows only

#### Installer

The installer is built using [NSIS](http://nsis.sourceforge.net). You have to install NSIS version 3.0, and add its folder to PATH in Environment Variables, so it is reachable to scripts in this project. For example, `C:\Program Files (x86)\NSIS`.

#### 32-bit build on 64-bit Windows

There are still a lot of 32-bit Windows installations in use. If you want to support those systems and have 64-bit OS make sure you've installed 32-bit (instead of 64-bit) Node version. There are [versions managers](https://github.com/coreybutler/nvm-windows) if you feel the need for both architectures on the same machine.
