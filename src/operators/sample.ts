import { Operator } from "../pipe-types";
import { through } from "./through";
import { Pressure } from "../pressure";
import { aside, loop } from "../utils";
import { Outlet } from "../outlet";
import { pipe } from "../pipe";
import { Valve } from "../valve";

export function sampleFirst<T>(pressure: Pressure): Operator<T>
{
    return input => pipe( outlet => {
        let buffer: T|undefined;
        const cancel = loop(pressure, () => {
            if (buffer) {
                outlet.next(buffer);
                buffer = undefined;
            }
        });
        const pluck = input.flush( Outlet.to(val => { buffer = buffer ?? val }) );
        return () => {
            cancel();
            pluck();
        }
    });
}

export function sampleLast<T>(pressure: Pressure): Operator<T>
{
    return input => pipe( outlet => {
        let buffer: T|undefined;
        const cancel = loop(pressure, () => {
            if (buffer) {
                outlet.next(buffer);
                buffer = undefined;
            }
        });
        const pluck = input.flush( Outlet.to(val => { buffer = val }) );
        return () => {
            cancel();
            pluck();
        }
    });
}
