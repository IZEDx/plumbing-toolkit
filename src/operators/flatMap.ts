import { Pipe } from "../pipe";
import { through } from ".";
import { Outlet } from "../outlet";

export type FlatMappingFn<T, K> = (x: T) => Pipe<K>;

export function flatMap<T, K>(mapper: FlatMappingFn<T, K>) {
    return through<T, K>(async (value, outlet) => {
        mapper(value).flush(Outlet.suppressReturn(outlet));
    });
}
