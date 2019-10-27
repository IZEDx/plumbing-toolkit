
import { expect } from "chai";
import "mocha";
import { pipe, from, timeout } from "../src";
import { Valve } from "../src/valve";

describe("Valve", () => {

    it("should be done when pipe completed", async () => {
        const valve = new Valve<number>();
        pipe(from([1,2,3,4,5])).flush(valve);
        await timeout(50);
        expect((await valve.drain()).done).to.equal(true);
    });

    it("should wait for the next value", async () => {
        const valve = new Valve<number>();
        pipe(from([1,2,3,4,5])).flush(valve);
        expect((await valve.drain()).value).to.equal(1);
    });


});