
import { Sink } from ".";
import { collect, collector, ConsumerFn, to, toEach, first, last, forEach, OperatorFn, through } from "./tools";
import { MappingFn, map, FlatMappingFn, flatMap } from "./transformators";
import { PredicateFn, filter, Constructable, is } from "./filters";

export type Pluck = () => any;
export type Spring<T> = (sink: Sink<T>) => Pluck;
export type Operator<T, K = T, R = Pipe<K>> = (input: Pipe<T>) => R;
//export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

export function pipe<T>(spring: Spring<T>) {
    return new Pipe(spring);
}

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

    ////////////////////////////////////////////////////////////////////////////////////////////

    queue = () => this.pipe(collector());
    collect = () => this.pipe(collect());
    to = (c: ConsumerFn<T>) => this.pipe(to(c));
    toEach = <K>(a: K[], c: (a: T, b: K) => any) => this.pipe(toEach(a, c));
    first = () => this.pipe(first());
    last = () => this.pipe(last());

    forEach = (c: ConsumerFn<T>) => this.pipe(forEach(c));
    through = <K>(o: OperatorFn<T, K>) => this.pipe(through(o));

    map = <K>(m: MappingFn<T, K>) => this.pipe(map(m));
    flatMap = <K>(m: FlatMappingFn<T, K>) => this.pipe(flatMap(m));

    filter = (p: PredicateFn<T>) => this.pipe(filter(p));
    is = <K extends T = T>(c: Constructable<K>) => this.pipe(is(c));

}
