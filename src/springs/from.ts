import { Outlet } from "../outlet";
import { immediate, Pressure } from "../pressure";
import { Spring } from "../pipe";

function isAsyncIterable<T>(ai: Object): ai is AsyncIterable<T>
{
    return ai[Symbol.asyncIterator] != undefined;
}

/**
 * Creates a [Spring] from [i]
 * @param i 
 */
export function from<T>(i: Iterable<T>|AsyncIterable<T>, pressure: Pressure = immediate): Spring<T>
{
    return (outlet: Outlet<T>) => {
        (async () => {
            await pressure();
            try {
                if ( isAsyncIterable<T>(i) ) {
                    for await (const data of i) {
                        if (outlet.plucked) break;
                        outlet.next(data);
                        await pressure();
                    }
                } else {
                    for (const data of i) {
                        if (outlet.plucked) break;
                        outlet.next(data);
                        await pressure();
                    }
                }
                outlet.complete();
            } catch(e) {
                outlet.error(e);
            }
        })();
        return () => outlet.pluck();
    }
}

/**
 * Alias for [from]
 * @param i 
 */
export function pump<T>(i: Iterable<T>|AsyncIterable<T>, pressure: Pressure = immediate): Spring<T>
{
    return from(i);
}
