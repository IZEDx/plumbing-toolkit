import { MaybePromise, maybeAwait, through } from "..";

export type PredicateFn<T> = (x: T) => MaybePromise<boolean>;

export function filter<T>(predicate: PredicateFn<T>) {
    return through<T, T>( async (value, sink) => 
        ( await maybeAwait( predicate(value) ) ) 
        ? sink.next(value) 
        : undefined 
    );
}