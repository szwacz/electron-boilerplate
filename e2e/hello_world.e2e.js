import { expect } from "chai";
import testUtils from "./utils";

describe("application launch", function() {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("shows hello world text on screen after launch", function() {
    return this.app.client.$("#greet").then(element => {
      return element.getText().then(text => {
        expect(text).to.equal("Hello World!");
      });
    });
  });
});
