
import { expect } from "chai";
import "mocha";

import { Outlet } from "../src";
import { fibonacci } from "../src/springs/fibonacci";
import { Spring } from "../src/pipe-types";
import { from } from "../src/springs/from";
import { timeout } from "../src/pressure";


function expectSpringEquals<T>(spring: Spring<T>, expected: T[])
{
    return new Promise((res) => {
        let i = 0;
        spring(new Outlet({
            next: v => {
                expect(v).to.equal(expected[i++]);
            },
            complete: () => {
                expect(i).to.equal(expected.length);
                res();
            }
        }));
    })
}

function expectSpringPluck<T>(spring: Spring<T>)
{
    return new Promise((res, rej) => {
        let i = 0;
        let outlet: Outlet<T>;
        const pluck = spring(outlet = new Outlet({
            next: async v => {
                try {
                    i++;
                    expect(i).to.equal(1);
                    pluck();
                    expect(outlet.plucked).to.equal(true);
                    await timeout(100);
                    res();
                } catch(e) { rej(e) }
            },
            complete: () => {
                try {
                    expect(true).to.equal(false, "Spring should not complete after pluck");
                } catch(e) { rej(e) }
            }
        }));
    })

}

async function* testAsyncIterable()
{
    yield 1;
    await timeout(0);
    yield 2;
    await timeout(0);
    yield 3;
    await timeout(0);
    yield 4;
    await timeout(0);
    yield 5;
}

describe("Springs", () => {

    describe("fibonacci", () => {
        it("should produce fibonacci sequence", async () => {
            await expectSpringEquals(fibonacci(5), [1, 1, 2, 3, 5]);
        });
        it("should pluck", async () => {
            await expectSpringPluck(fibonacci(5));
        });
    });

    describe("from", () => {
        it ("should pump from iterable", async () => {
            await expectSpringEquals(from([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
        });
        it("should pluck iterable", async () => {
            await expectSpringPluck(from([1, 2, 3, 4, 5]));
        });
        it ("should pump from asyncIterable", async () => {
            await expectSpringEquals(from(testAsyncIterable()), [1, 2, 3, 4, 5]);
        });
        it("should pluck asyncIterable", async () => {
            await expectSpringPluck(from(testAsyncIterable()));
        });
    });
});