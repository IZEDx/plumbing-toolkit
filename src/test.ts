import { pipe } from "./pipe";
import { fibonacci, interval } from "./springs";
import { context, forEach, filter, map, consume, updateContext, select } from "./operators";
/*
pipe(fibonacci(20)).chain(
    context(-1),
    forEach(p => p.context++),
    filter(p => p.value % 2 == 0),
    map(p => `${p.context}: ${p.value}`),
    consume(console.log)
)*/



pipe(interval(1000)).chain(
    context([0, 1]),
    updateContext(p => [
        p.context[1], 
        p.context[0] + p.context[1]
    ]),
    select("context", "value"),
    consume(console.log)
)



type Default = true;
type Transformer<T, R> = (val: T) => R;
type Pattern = any;

type Case<T, R> = <G = T>(condition: boolean, result: ((val: G) => R)|R) => void;

class MatchResult<T> {
    constructor(public value: T) {}
}
function match<T, R>(input: T, cases: (c: Case<T, R>, input: T) => void): R
{
    try {
        cases((condition, result) => {
            if ( 
                (condition)
            ) {
                throw new MatchResult(typeof result === "function" 
                    ? (result as any)(input)
                    : result
                );
            } 
        }, input);
    } catch(result) {
        if (result instanceof MatchResult)
        {
            return result.value;
        }
        throw result;
    }
    throw new Error("Non exhaustive match!");
}

const tests = [
    "Hello World",
    "Bla", 
    20
];


tests.forEach((test, index) => 
{
    const result = match<string|number, string>(test, (case_, input) => {
        case_(typeof input === "number", "input is a number: " + input);
        case_(input === "Hello World",   "Must be hello world!");
        case_(true,                      "Anything else!");
    })

    console.log(`Test #${index}:
        ${test} -> ${result}
    `);
});