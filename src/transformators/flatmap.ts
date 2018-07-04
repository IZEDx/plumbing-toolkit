
import { Pipe, Sink, through } from "..";

export type FlatMappingFn<T, K> = (x: T) => Pipe<K>;

export function flatMap<T, K>(mapper: FlatMappingFn<T, K>) {
    return through<T, K>(async (value, sink) => {
        mapper(value).flush(Sink.suppresReturn(sink));
    });
}
