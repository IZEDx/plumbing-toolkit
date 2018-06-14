
import { Sink, Tank, MaybePromise } from ".";

export type Pluck = () => any;
export type Spring<T> = (sink: Sink<T>) => Pluck;
export type Operator<T, K = T> = (input: Pipe<T>) => Pipe<K>;

export class Pipe<T> {

    /**
     * Creates a Pipe Interface on a Spring
     * @param _spring
     */
    constructor(private _spring: Spring<T>) {
    }

    /**
     * Creates a Pipe Interface on an AsyncIterable by pumping the data out of it.
     * @param ai 
     * @param waitForPromises 
     */
    static pump<T>(ai: AsyncIterable<T>, waitForPromises = false): Pipe<T> {
        return new Pipe<T>((sink: Sink<T>) => {
            (async () => {
                try {
                    for await(const data of ai) {
                        if (sink.plucked) break;
                        const r = sink.next(data);
                        if (waitForPromises && r instanceof Promise) await r;
                    }
                    sink.return();
                } catch(e) {
                    sink.throw(e);
                }
            })();
            return () => sink.pluck();
        });
    }

    static operator<T, K>(next: (value: T, sink: Sink<K>) => MaybePromise<void>): Operator<T, K> {
        return input => new Pipe<K>(sink => input.flush( Sink.throughTo(next, sink) ) );
    }

    pipe<K>(operator: Operator<T, K>): Pipe<K> {
        return operator(this);
    }

    flush(sink: Sink<T>) {
        return this._spring(sink);
    }

    collect(): AsyncIterable<T> {
        const spring = this._spring;
        return {
            [Symbol.asyncIterator]() {
                const tank = new Tank<T>();
                spring(tank);
                return { next: () => tank.pump() }
            }
        }
    }
}
