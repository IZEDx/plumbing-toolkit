import { Sink, Spring } from "..";

/**
 * Creates a Pipe Interface on an AsyncIterable by pumping the data out of it.
 * @param ai 
 * @param waitForPromises 
 */
export function pump<T>(ai: AsyncIterable<T>, waitForPromises = false): Spring<T> {
    return (sink: Sink<T>) => {
        (async () => {
            try {
                for await(const data of ai) {
                    if (sink.plucked) break;
                    const r = sink.next(data);
                    if (waitForPromises && r instanceof Promise) await r;
                }
                sink.return();
            } catch(e) {
                sink.throw(e);
            }
        })();
        return () => sink.pluck();
    }
}