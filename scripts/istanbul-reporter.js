var istanbul = require('istanbul'),

/**
 * Expose `Istanbul`.
 */
exports = module.exports = Istanbul;

/**
 * Initialize a new Istanbul reporter.
 *
 * @param {Runner} runner
 * @param {Object} options
 * @public
 */
function Istanbul(runner, options) {
    mocha.reporters.Base.call(this, runner);

    var reporterOpts = { dir: 'coverage' },
        reporters = ['text-summary', 'html'];

    options = options || {};
    if (options.reporters) reporters = options.reporters.split(',');
    if (process.env.ISTANBUL_REPORTERS) reporters = process.env.ISTANBUL_REPORTERS.split(',');
    if (options.reportDir) reporterOpts.dir = options.reportDir;
    if (process.env.ISTANBUL_REPORT_DIR) reporterOpts.dir = process.env.ISTANBUL_REPORT_DIR;

    runner.on('end', function(){
        var cov = global.__coverage__ || {},
            collector = new istanbul.Collector();

        collector.add(cov);

        reporters.forEach(function(reporter) {
            istanbul.Report.create(reporter, reporterOpts).writeReport(collector, true);
        });

    });

}
