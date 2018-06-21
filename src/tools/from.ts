import { Sink, Spring, immediate } from "..";

function isAsyncIterable<T>(ai: Object): ai is AsyncIterable<T> {
    return ai[Symbol.asyncIterator] != undefined;
}

export function from<T>(i: Iterable<T>|AsyncIterable<T>): Spring<T> {
    return (sink: Sink<T>) => {
        (async () => {
            try {
                if ( isAsyncIterable<T>(i) ) {
                    for await (const data of i) {
                        if (sink.plucked) break;
                        sink.next(data);
                        await immediate();
                    }
                } else {
                    for (const data of i) {
                        if (sink.plucked) break;
                        sink.next(data);
                        await immediate();
                    }
                }
                sink.return();
            } catch(e) {
                sink.throw(e);
            }
        })();
        return () => sink.pluck();
    }
}

export function pump<T>(i: Iterable<T>|AsyncIterable<T>): Spring<T> {
    return from(i);
}