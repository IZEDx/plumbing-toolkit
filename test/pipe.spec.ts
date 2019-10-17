
import { expect } from "chai";
import "mocha";

import { pipe, Outlet } from "../src";

const p = pipe((sink: Outlet<number>) =>  {
  [0,1,2,3,4,5,6,7,8,9].forEach((val) => sink.next(val));
  sink.complete();
  return () => {};
});

describe("Pipe", () => {

  it("should flush", (done) => {

    let check = "";
    p.flush(new Outlet({
      next:  num => { check += num; },
      complete: () => { expect(check).to.equal("0123456789"); done() }
    }));

  });

  it("should pipe", async () => {

    const promise = p.pipe(pp => new Promise<string>(resolve => {
      let check = "";
      pp.flush(new Outlet({
        next: num => { check += num; },
        complete: () => resolve(check)
      }));
    }));

    expect(await promise).to.equal("0123456789");
    
  });

  it("should chain", async () => {
    expect(true).to.equal(true); // TODO: Not implemented
  });


});