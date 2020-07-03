import { Pressure } from "./pressure";

export type Optional<T> = { [P in keyof T]?: T[P] }
export type MaybePromise<T> = Promise<T>|T;
export const maybeAwait = async <T>(mp: MaybePromise<T>) => mp instanceof Promise ? await mp : mp;

export function aside<T>(fn: () => Promise<T>): Promise<T>
{
    return fn();
}

export function loop(pressure: Pressure, fn: (cancel: () => void) => MaybePromise<any>, waitAtStart = false)
{
    let _break = false;
    const cancel = () => _break = true;
    if (waitAtStart) fn(cancel);
    aside(async () => {
        while(!_break)
        {
            await pressure();
            await fn(cancel);
        }
    });
    return () => _break = true;
}
