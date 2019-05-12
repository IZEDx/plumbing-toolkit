import { MaybePromise } from "../utils";
import { Operator, Pluck, Pipe } from "../pipe";
import { Tank } from "../tank";
import { Sink } from "../sink";

export type ConsumerFn<T> = (value: T) => MaybePromise<any>;

/**
 * Transforms the stream into a buffered AsyncIterable
 */
export function collector<T>(): Operator<T, T, AsyncIterable<T>>
{
    return input => {
        return {
            [Symbol.asyncIterator]()
            {
                const tank = new Tank<T>();
                input.flush(tank);
                return { next: () => tank.pump() }
            }
        }
    };
}

/**
 * Collects the stream into an Array
 */
export function collect<T>(): Operator<T, T, Promise<T[]>>
{
    return input => new Promise(async (resolve, reject) => {
        const it = input.pipe( collector() );
        const collection: T[] = [];

        try {
            for await (const value of it) {
                collection.push(value);
            }    
            resolve(collection);
        } catch(err) {
            reject(err);
        }
    });
}

/**
 * Flushes the stream into a [consumer]
 * @param fn 
 */
export function to<T>(consumer: ConsumerFn<T>): Operator<T, T, Pluck>
{
    return input => input.flush( Sink.to(consumer) );
}

/**
 * Flushes the stream for each entry in [arr] into [consumer]
 * @param arr 
 * @param fn 
 */
export function toEach<T, K>(arr: K[], consumer: (a: T, b: K) => void): Operator<T, T, Pluck>
{
    return to(a => arr.forEach(b => consumer(a, b)));
}

/**
 * Returns the first element of the stream
 * @param fn 
 */
export function first<T>(): Operator<T, T, Promise<T>>
{
    return input => new Promise<T>((resolve, reject) => {
        let resolved = false;
        const pluck = input.flush(new Sink({
            next: val => {
                resolved = true;
                pluck();
                resolve(val);
            },
            return: () => {
                if (!resolved) {
                    reject();
                }
            },
            throw: err => {
                reject(err);
            }
        }));
    });
}

/**
 * Returns the last element of the stream
 * @param fn 
 */
export function last<T>(): Operator<T, T, Promise<T>>
{
    return (input: Pipe<T>) => new Promise<T>((resolve, reject) => {
        let lastval: T;
        input.flush(new Sink({
            next: val => {
                lastval = val
            },
            return: () => {
                if (lastval === undefined) {
                    reject();
                } else {
                    resolve(lastval);
                }
            },
            throw: err => {
                reject(err);
            }
        }));
    });
}
