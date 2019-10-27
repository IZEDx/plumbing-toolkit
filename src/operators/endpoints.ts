import { MaybePromise } from "../utils";
import { Operator, Pluck } from "../pipe";
import { Tank } from "../tank";
import { Outlet } from "../outlet";

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
                return { next: () => tank.drain() }
            }
        }
    };
}

/**
 * Collects the stream into an Array
 */
export function collect<T>(): Operator<T, T, Promise<T[]>>
{
    return async input => {
        const it = input.pipe( collector() );
        const collection: T[] = [];

        for await (const value of it) {
            collection.push(value);
        }    
        return collection;
    };
}

/**
 * Flushes the stream into a [consumer]
 * @param fn 
 */
export function consume<T>(consumer: ConsumerFn<T>, err?: (err: any) => MaybePromise<void>): Operator<T, T, Pluck>
{
    return input => input.flush( Outlet.to(consumer, err) );
}

/**
 * Flushes the stream for each entry in [arr] into [consumer]
 * @param arr 
 * @param fn 
 */
export function consumeEach<T, K>(arr: K[], consumer: (a: T, b: K) => void): Operator<T, T, Pluck>
{
    return consume(a => arr.forEach(b => consumer(a, b)));
}

/**
 * Returns the first element of the stream
 * @param fn 
 */
export function first<T>(): Operator<T, T, Promise<T>>
{
    return input => new Promise<T>((resolve, reject) => {
        let resolved = false;
        const pluck = input.flush(new Outlet({
            next: val => {
                resolved = true;
                pluck();
                resolve(val);
            },
            complete: () => {
                if (!resolved) {
                    reject();
                }
            },
            error: err => {
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
    return input => new Promise<T>((resolve, reject) => {
        let lastval: T;
        input.flush(new Outlet({
            next: val => {
                lastval = val
            },
            complete: () => {
                if (lastval === undefined) {
                    reject();
                } else {
                    resolve(lastval);
                }
            },
            error: err => {
                reject(err);
            }
        }));
    });
}
