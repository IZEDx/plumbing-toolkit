import { Operator } from "../pipe";
import { through } from "./through";

export function forEach<T>(consumer: (value: T) => any): Operator<T, T>
{
    return through((value, outlet) => {
        consumer(value);
        return outlet.next(value);
    });
}
