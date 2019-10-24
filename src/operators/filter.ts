import { MaybePromise, maybeAwait } from "../utils";
import { through } from ".";

export type PredicateFn<T> = (x: T) => MaybePromise<boolean>;

export function filter<T>(predicate: PredicateFn<T>) {
    return through<T, T>( async (value, outlet) => 
        ( await maybeAwait( predicate(value) ) ) 
        ? outlet.next(value) 
        : undefined 
    );
}

