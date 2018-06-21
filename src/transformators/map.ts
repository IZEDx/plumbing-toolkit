import { MaybePromise, maybeAwait, through } from "..";

export type MappingFn<T, K> = (x: T) => MaybePromise<K>;

export function map<T, K>(mapper: MappingFn<T, K>) {
    return through<T, K>( async (value, sink) => sink.next( await maybeAwait( mapper(value) ) ) );
}