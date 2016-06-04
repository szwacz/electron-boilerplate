// Tests here are for easier maintenance of this boilerplate.
// Feel free to delete this file in your own project.

import { expect } from 'chai';
import env from '../env';

describe("boilerplate tests", function () {

    it("environment variables should be on their place", function () {
        expect(env.name).to.equal('test');
        expect(env.description).to.equal('Add here any environment specific stuff you like.');
    });

});
