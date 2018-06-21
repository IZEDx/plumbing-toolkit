
const polyfillSymbol = (name: string): symbol => Symbol[name] !== undefined ? Symbol[name] : ((<any>Symbol)[name] = Symbol.for(name));
const polyfillAsyncIterator = () => polyfillSymbol("asyncIterator");
polyfillAsyncIterator();

export type Optional<T> = { [P in keyof T]?: T[P] }
export type MaybePromise<T> = Promise<T>|T;
export const maybeAwait = async <T>(mp: MaybePromise<T>) => mp instanceof Promise ? await mp : mp;


export * from "./sink";
export * from "./pipe";
export * from "./tank";
export * from "./pressure";

export * from "./tools";
export * from "./springs";
export * from "./filters";
export * from "./transformators";