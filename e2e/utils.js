import electron from 'electron';
import { Application } from 'spectron';

var beforeEach = function () {
    this.app = new Application({
        path: electron,
        args: ['app'],
        waitTimeout: 10000,
    });
    return this.app.start();
};

var afterEach = function () {
    if (this.app && this.app.isRunning()) {
        return this.app.stop();
    }
};

export default {
    beforeEach: beforeEach,
    afterEach: afterEach,
};
