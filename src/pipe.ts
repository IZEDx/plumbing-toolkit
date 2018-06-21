
import { Sink } from ".";

export type Pluck = () => any;
export type Spring<T> = (sink: Sink<T>) => Pluck;
export type Operator<T, K = T, R = Pipe<K>> = (input: Pipe<T>) => R;
//export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

export class Pipe<T> {

    /**
     * Creates a Pipe Interface on a Spring
     * @param _spring
     */
    constructor(private _spring: Spring<T>) {
    }

    pipe<K, R = Pipe<K>>(operator: Operator<T, K, R>): ReturnType<Operator<T, K, R>> {
        return operator(this);
    }

    flush(sink: Sink<T>) {
        return this._spring(sink);
    }
}

export function pipe<T>(spring: Spring<T>) {
    return new Pipe(spring);
}
