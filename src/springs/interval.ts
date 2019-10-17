import { Outlet } from "../outlet";
import { Spring } from "../pipe";

export function interval(ms: number): Spring<number> {
    return (outlet: Outlet<number>) => {
        let i = 0;
        const handle = setInterval(() => outlet.next(i++), ms);
        return () => clearInterval(handle);
    }
}