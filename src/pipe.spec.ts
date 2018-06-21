
import { expect } from "chai";
import "mocha";

import { pipe, Sink } from ".";

const p = pipe((sink: Sink<number>) =>  {
  [0,1,2,3,4,5,6,7,8,9].forEach((val) => sink.next(val));
  sink.return();
  return () => {};
});

describe("Pipe", () => {

  it("should flush correctly", (done) => {

    let check = "";
    p.flush(new Sink({
      next:  num => { check += num; },
      return: () => { expect(check).to.equal("0123456789"); done() }
    }));

  });

  it("should pipe correctly", async () => {

    const promise = p.pipe(pp => new Promise<string>(resolve => {
      let check = "";
      pp.flush(new Sink({
        next: num => { check += num; },
        return: () => resolve(check)
      }));
    }));

    expect(await promise).to.equal("0123456789");
    
  });


});