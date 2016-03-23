import { expect } from 'chai';
import greet from './hello_universe';

describe("hello universe", function () {

    it("greets better than hello world", function () {
        expect(greet()).to.equal('Hello Universe!');
    });

});
