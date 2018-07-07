import { Operator } from "../pipe";
import { through } from "./through";

export function forEach<T>(consumer: (value: T) => any): Operator<T, T>
{
    return through((value, sink) => {
        consumer(value);
        sink.next(value);
    });
}
