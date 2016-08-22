import './branding/branding.js';
import { start } from './scripts/start';
import { remote } from 'electron';
var app = remote.app;

Bugsnag.metaData = {
	// platformId: app.process.platform,
	// platformArch: app.process.arch,
	// electronVersion: app.process.versions.electron,
	version: app.getVersion()
		// platformVersion: cordova.platformVersion
		// build: appInfo.build
};

Bugsnag.appVersion = app.getVersion();

window.$ = window.jQuery = require('./vendor/jquery-1.12.0');
start();