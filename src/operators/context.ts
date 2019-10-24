import { Operator } from "../pipe";
import { through } from "./through";
import { MappingFn } from "./map";

export interface ContextProvider<C, T> {
    context: C,
    value: T
}
export function context<T, C>(context: C): Operator<T, ContextProvider<C, T>>
{
    return through((value, outlet) => {
        return outlet.next({
            get context() { return context },
            set context(c: C) { context = c },
            value
        });
    });
}

export function updateContext<T, C, P extends ContextProvider<C, T>>(fn: MappingFn<P, C>): Operator<P, P>
{
    return through(async (value, outlet) => {
        value.context = await fn(value);
        return outlet.next(value);
    });
}