'use strict';

class ClientReceiver {
  constructor() {
    this.buildPassed = true;
  }

  specDone(result) {
    if (result.failedExpectations.length > 0) {
      this.buildPassed = false;
      console.log('Failed: ', result.failedExpectations.length);
      for (var i = 0; i < result.failedExpectations.length; i++) {
        console.log('Failure: ' + result.failedExpectations[i].message);
        console.log(result.failedExpectations[i].stack);
      }
    }
    if (result.passedExpectations.length > 0) {
      console.log('Passed: ', result.passedExpectations.length);
    }
  }

  jasmineDone() {
    if (this.buildPassed) {
      console.log('Finished Successfully');
      process.exit(0);
    } else {
      console.log('Finished Unsuccessfully');
      process.exit(1);
    }
  }
}

module.exports = ClientReceiver;
