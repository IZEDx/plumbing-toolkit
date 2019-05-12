import { pipe } from "./pipe";
import { fibonacci } from "./springs";
import { map } from "./transformators";
import { filter } from "./filters";
import { to, forEach } from "./tools";

let c = 0;
pipe(fibonacci(20))
    .forEach(n => c++)
    .filter(n => n % 2 == 0)
    .map(n => `${c}: ${n}`)
    .to(s => console.log(s));