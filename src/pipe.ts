
import { Outlet } from "./outlet";
import { Spring, Operator, IPipe } from "./pipe-types";

export * from "./pipe-types";

export function pipe<T>(spring: Spring<T>): IPipe<T> {
    return new Pipe(spring);
}

export class Pipe<T> implements IPipe<T> {

    /**
     * Creates a Pipe Interface on a Spring
     * @param _spring
     */
    constructor(private _spring: Spring<T>) {
    }

    pipe<K, R = IPipe<K>>(operator: Operator<T, K, R>): ReturnType<Operator<T, K, R>> {
        return operator(this);
    }

    flush(outlet: Outlet<T>) {
        const pluck = this._spring(outlet);
        return () => {
            outlet.pluck();
            pluck();
        }
    }

    chain(...operators: Operator<any>[]): any
    {
        let result: any = this;
        for (const op of operators) {
            result = result.pipe(op);
        }
        return result;
    }
}
