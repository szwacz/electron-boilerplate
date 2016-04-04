import { expect } from 'chai';
import { greet, bye } from './hello_world';

describe("hello world", function () {

    it("greets", function () {
        expect(greet()).to.equal('Hello World!');
    });

    it("says goodbye", function () {
        expect(bye()).to.equal('See ya!');
    });

});
