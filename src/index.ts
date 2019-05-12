
const polyfillSymbol = (name: string): symbol => Symbol[name] !== undefined ? Symbol[name] : ((<any>Symbol)[name] = Symbol.for(name));
const polyfillAsyncIterator = () => polyfillSymbol("asyncIterator");
polyfillAsyncIterator();

export * from "./utils";
export * from "./sink";
export * from "./pipe";
export * from "./tank";
export * from "./pressure";

export * from "./tools";
export * from "./springs";
export * from "./filters";
export * from "./transformators";