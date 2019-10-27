import { Optional, MaybePromise } from "./utils";
import { Outlet, IDrainable } from "./outlet";

type Awaiter<T> = {
    resolve: (value: IteratorResult<T>) => any;
    reject: (error: Error) => any;
};

export class Valve<T> extends Outlet<T> implements IDrainable<T> {
    private _result?: IteratorResult<T>;
    private _error?: Error;
    private _awaiters: Awaiter<T>[] = [];

    get hasError() {
        return this._error !== undefined;
    }

    get hasValue() {
        return this._result !== undefined;
    }

    get hasAwaiters() {
        return this._awaiters.length > 0;
    }

    constructor() {
        super({
            next: (value: T) => {
                if (this.hasAwaiters) {
                    this.callAwaiters(a => a.resolve({done: false, value}));
                } else {
                    this._result = {done: false, value};
                }
            },
            complete: () => {
                if (this.hasAwaiters) {
                    this.callAwaiters(a => a.resolve({done: true, value: null}));
                } else {
                    this._result = {done: true, value: null};
                }
            },
            error: (err: Error) => {
                if (this.hasAwaiters) {
                    this.callAwaiters(a => a.reject(err));
                } else {
                    this._error = err;
                }
            }
        });
    }

    private callAwaiters(fn: (a: Awaiter<T>) => any)
    {
        this._awaiters.forEach(fn);
        this._awaiters = [];
    }

    [Symbol.asyncIterator]()
    {
        return { next: () => this.drain() }
    }

    drain(): Promise<IteratorResult<T>> {
        return new Promise<IteratorResult<T>>((resolve, reject) => {
            if (this.hasError) {
                reject(this._error);
                this._error = undefined;
            } else if (this.hasValue) {
                resolve(this._result);
                if (!this._result!.done) {
                    this._result = undefined;
                }
            } else {
                this._awaiters.push({resolve, reject});
            }
        });
    }
}