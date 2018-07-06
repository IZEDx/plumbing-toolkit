
import { Operator, Tank } from "..";

export function collector<T>(): Operator<T, T, AsyncIterable<T>>
{
    return input => {
        return {
            [Symbol.asyncIterator]()
            {
                const tank = new Tank<T>();
                input.flush(tank);
                return { next: () => tank.pump() }
            }
        }
    };
}