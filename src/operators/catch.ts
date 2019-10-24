import { Outlet } from "../outlet";
import { Operator, pipe } from "../pipe";
import { OperatorFn } from "./through";

export function error<T, K = T>(fn: OperatorFn<any, T>): Operator<T, T>
{
    return input => {
        return pipe( outlet => input.flush( Outlet.to(outlet.next, err => fn(err, outlet)) ) );
    }
}

