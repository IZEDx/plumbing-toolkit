import { Operator } from "../pipe-types";
import { through } from "./through";


export function parallel<T>(): Operator<T, T>
{
    return through((v, outlet) => {
        outlet.next(v);
    })
}
