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
    updateContext(p => [p.context[1], p.context[0] + p.context[1]]),
    select("context", "value"),
    consume(console.log)
)