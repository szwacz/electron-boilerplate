'use strict';

class ClientReporter {

  constructor() {
    this.buildPassed = true;
    this.emitter = false;
  }

  setEmitter(emitter) {
    this.emitter = emitter;
  }

  specDone(result) {
    if (this.emitter) {
      this.emitter.specDone(result);
    } else {
      setTimeout(() => {
        this.specDone(result);
      }, 100);
    }
  }

  jasmineDone() {
    if (this.emitter) {
      this.emitter.jasmineDone();
      setTimeout(() => {
        window.close();
      }, 100);
    } else {
      setTimeout(() => {
        this.jasmineDone();
      }, 100);
    }
  }
}

module.exports = ClientReporter;
