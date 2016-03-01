var app = require('electron').app;

module.exports = {
	forceQuit: function() {
		app.forceQuit = true;
		app.quit();
	}
};
