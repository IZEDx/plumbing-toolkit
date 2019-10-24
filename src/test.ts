import { pipe } from "./pipe";
import { fibonacci, interval } from "./springs";
import { context, forEach, filter, map, consume } from "./operators";

pipe(fibonacci(20)).chain(
    context(-1),
    forEach(p => p.context++),
    filter(p => p.value % 2 == 0),
    map(p => `${p.context}: ${p.value}`),
    consume(console.log)
)

pipe(interval(1000)).chain(
    context([0, 1]),
    forEach(p => p.context = [p.context[1], p.context[0] + p.context[1]]),
    map(p => `${p.value}: ${p.context[0]}`),
    consume(console.log)
)