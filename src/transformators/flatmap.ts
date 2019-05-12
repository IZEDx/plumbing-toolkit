import { Pipe } from "../pipe";
import { through } from "../tools";
import { Sink } from "../sink";

export type FlatMappingFn<T, K> = (x: T) => Pipe<K>;

export function flatMap<T, K>(mapper: FlatMappingFn<T, K>) {
    return through<T, K>(async (value, sink) => {
        mapper(value).flush(Sink.suppressReturn(sink));
    });
}
