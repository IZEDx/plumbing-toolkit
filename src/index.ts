
function polyfillSymbol(name: string) {
    if (Symbol[name] === undefined) (<any>Symbol)[name] = Symbol.for(name);
}

export function polyfillAsyncIterator() {
    polyfillSymbol("asyncIterator");
}

polyfillAsyncIterator();

export type MaybePromise<T> = Promise<T>|T;
export async function maybeAwait<T>(mp: MaybePromise<T>) {
    return mp instanceof Promise ? await mp : mp;
}

export type Optional<T> = { 
    [P in keyof T]?: T[P] 
}

export * from "./sink";
export * from "./pipe";
export * from "./tank";
export * from "./pressure";