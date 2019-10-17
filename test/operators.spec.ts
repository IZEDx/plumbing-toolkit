
import { expect } from "chai";
import "mocha";
import { pipe } from "../src/pipe";
import { fibonacci } from "../src/springs";
import { context } from "../src/operators/context";
import { collect } from "../src/operators/endpoints";
import { forEach } from "../src/operators/forEach";


const p = () => pipe(fibonacci(5));

describe("Operators", () => {

    describe("context", () => {
        it("should provide value", async () => {
            const result = await p().chain(
                context(42),
                collect()
            )
            expect(result).to.deep.equal([1, 1, 2, 3, 5].map(n => ({
                context: 42,
                value: n
            })));
        });
        it("should update value", async () => {
            const result = await p().chain(
                context(42),
                forEach(c => c.context++),
                collect()
            )
            expect(result).to.deep.equal([1, 1, 2, 3, 5].map((n, i) => ({
                context: 47,
                value: n
            })));
        });
    });

    describe("collector", () => {
        it("should collect and yield values", async () => {

        });
    })
});