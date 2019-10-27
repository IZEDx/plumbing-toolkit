import { Operator } from "../pipe-types";
import { through } from "./through";


export function defer<T>(): Operator<T, T>
{
    return through((v, outlet) => {
        outlet.next(v);
    })
}
