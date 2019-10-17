
import { forEach } from "./forEach";
import { map } from ".";
import { pipe, Operator } from "../pipe";


export function deltaTime<T>(): Operator<T, [T, number]>
{
    return input => pipe(sink => {
        let last = Date.now();
        return input
            .pipe( map(value => [value, Date.now() - last]) )
            .pipe( forEach(() => last = Date.now()) )
            .flush( sink );
    });
}
