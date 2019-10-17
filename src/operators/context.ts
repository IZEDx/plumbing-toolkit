import { Operator } from "../pipe";
import { through } from "./through";

export interface ContextProvider<C, T> {
    context: C,
    value: T
}
export function context<T, C>(context: C): Operator<T, ContextProvider<C, T>>
{
    return through((value, sink) => {
        sink.next({
            get context() { return context },
            set context(c: C) { context = c },
            value
        });
    });
}
