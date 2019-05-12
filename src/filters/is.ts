import { through } from "../tools";

export interface Constructable<T>
{
    new(...args: any[]): T;
}

function _is<T>(obj: Object, c: Constructable<T>): obj is T
{
    return obj instanceof c;
}

export function is<T, K extends T>(c: Constructable<K>)
{
    return through<T, K>( async (value, sink) => 
        _is(value, c)
        ? sink.next(value) 
        : undefined 
    );
}