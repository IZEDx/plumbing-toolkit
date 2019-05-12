
export type Optional<T> = { [P in keyof T]?: T[P] }
export type MaybePromise<T> = Promise<T>|T;
export const maybeAwait = async <T>(mp: MaybePromise<T>) => mp instanceof Promise ? await mp : mp;
