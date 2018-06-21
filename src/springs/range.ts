import { Spring, immediate } from "..";

export function range(from: number, to?: number, step = 1): Spring<number> {
    return sink => {
        (async () => { 
            try {
                for (let i = from; !sink.plucked && (!to || i < to); i += step) {
                    sink.next(i);
                    await immediate();
                }
                sink.return();
            } catch(err) {
                sink.throw(err);
            }
        })();
        return () => { sink.pluck() };
    }
}