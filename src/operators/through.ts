import { Outlet } from "../outlet";
import { MaybePromise } from "../utils";
import { Operator, pipe } from "../pipe";

export type OperatorFn<T, K> =  (value: T, outlet: Outlet<K>) => MaybePromise<void>;

export function through<T, K>(fn: OperatorFn<T, K>): Operator<T, K>
{
    return input => {
        return pipe( outlet => input.flush( Outlet.throughTo(fn, outlet) ) );
    }
}

