import { Outlet } from "../outlet";
import { Spring } from "../pipe";
import { timeout } from "../pressure";

export function interval(ms: number): Spring<number> {
    return (outlet: Outlet<number>) => {
        let stop = false;
        (async () => {
            for(let i = 0; !stop; i++)
            {
                await outlet.next(i);
                await timeout(ms);
            }
        });
        return () => stop = true;
    }
}