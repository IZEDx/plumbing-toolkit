import { Sink, MaybePromise, Operator, Pluck } from "..";

export type ConsumerFn<T> = (value: T) => MaybePromise<void>;

export function to<T>(fn: ConsumerFn<T>): Operator<T, T, Pluck> {
    return input => input.flush( Sink.to(fn) );
}