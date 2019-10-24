import { through } from ".";
import { Operator } from "../pipe-types";

type TupleTypes<T> = T extends (infer K)[] ? K : never;
export type Selection<
    T extends {}, 
    K1 extends keyof T, 
    K2 extends (keyof T)|undefined , 
    Kn extends (keyof T)[]
> = K2 extends keyof T ? T[K1|K2|TupleTypes<Kn>] : T[K1];

export function select<
    T extends {}, 
    K1 extends keyof T,
    K2 extends (keyof T)|undefined = undefined,
    Kn extends (keyof T)[] = [],
    R extends Selection<T, K1, K2, Kn> = Selection<T, K1, K2, Kn>
>
(key1: K1, key2?: K2, ...keys: Kn): Operator<T, R> {
    return through<T, R>( async (obj, outlet) => {
        if (key2 === undefined && keys.length === 0)
        {
            return outlet.next(obj[key1] as any);
        }
        else if (key2 === undefined)
        {
            const newObj = {} as any;
            [key1, ...keys].forEach(v => newObj[v] = obj[v])
            return outlet.next(newObj);
        }
        else
        {
            const newObj = {} as any;
            [key1, key2, ...keys].forEach(v => newObj[v] = obj[v as any])
            return outlet.next(newObj);
        }
    });
}
