const argv = require('minimist')(process.argv);

exports.getEnvName = () => {
	return argv.env || 'development';
};

exports.beepSound = () => {
	process.stdout.write('\u0007');
};

exports.beepOnError = (done) => {
	return(err) => {
		if(err) {
			exports.beepSound();
		}
		done(err);
	};
};
