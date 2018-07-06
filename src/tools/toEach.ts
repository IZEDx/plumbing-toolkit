
import { Operator, Pluck, to } from "..";

export function toEach<T, K>(arr: K[], fn: (a: T, b: K) => void): Operator<T, T, Pluck>
{
    return to(a => arr.forEach(b => fn(a, b)));
}
