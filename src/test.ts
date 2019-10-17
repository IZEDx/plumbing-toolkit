import { pipe } from "./pipe";
import { fibonacci } from "./springs";
import { context, forEach, filter, map, consume } from "./operators";

pipe(fibonacci(20)).chain(
    context(0),
    forEach(p => p.context++),
    filter(p => p.value % 2 == 0),
    map(p => `${p.context}: ${p.value}`),
    consume(console.log)
)