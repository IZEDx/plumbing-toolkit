import { Sink, Spring, immediate } from "..";

export function from<T>(i: Iterable<T>): Spring<T> {
    return (sink: Sink<T>) => {
        (async () => {
            try {
                for (const data of i) {
                    if (sink.plucked) break;
                    sink.next(data);
                    await immediate();
                }
                sink.return();
            } catch(e) {
                sink.throw(e);
            }
        })();
        return () => sink.pluck();
    }
}