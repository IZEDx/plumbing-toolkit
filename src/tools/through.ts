import { Sink, MaybePromise, Operator, pipe } from "..";

export type OperatorFn<T, K> =  (value: T, sink: Sink<K>) => MaybePromise<void>;

export function through<T, K>(fn: OperatorFn<T, K>): Operator<T, K>
{
    return input => {
        return pipe( sink => input.flush( Sink.throughTo(fn, sink) ) );
    }
}