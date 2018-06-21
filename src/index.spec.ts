
import { expect } from "chai";
import "mocha";

import { maybeAwait } from ".";

describe("maybeAwait", () => {

  it("should await promise", async () => {
    const promise = new Promise(res => res("TEST")); 

    expect(await maybeAwait(promise)).to.equal("TEST");
  });

  it("should not await not promise", async () => {
    const value = "TEST"; 

    expect(await maybeAwait(value)).to.equal("TEST");
  });

});