import { Spring, Sink } from "..";

export function interval(ms: number): Spring<number> {
    return (sink: Sink<number>) => {
        let i = 0;
        const handle = setInterval(() => sink.next(i++), ms);
        return () => clearInterval(handle);
    }
}