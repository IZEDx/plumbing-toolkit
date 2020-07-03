import { Operator, Pluck } from "../pipe-types";
import { PressureWithCancel } from "../pressure";
import { through } from "./through";
import { Valve } from "../valve";
import { loop } from "../utils";
import { pipe } from "../pipe";
import { Outlet } from "../outlet";

export function debounce<T>(pressure: PressureWithCancel): Operator<T>
{
    return input => pipe(outlet => {
        let cancel: Pluck|undefined;
        const target = Outlet.throughTo<T, T>(val=> { 
            cancel?.();
            const result = pressure();
            cancel = result.cancel;
            result.promise
                .then(() => outlet.next(val))
                .catch(err => outlet.error(err));
        }, outlet);
        input.flush(target);

        return () => {
            cancel?.();
            outlet.pluck();
            target.pluck();
        }
    });
}
