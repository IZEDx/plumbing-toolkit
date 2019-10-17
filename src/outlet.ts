import { MaybePromise } from "./utils";

export interface IOutlet<T> {
    next(value: T): MaybePromise<void>;
    error?(error: Error): MaybePromise<void>;
    complete?(): MaybePromise<void>;
    pluck?(): MaybePromise<void>;
    plucked?: boolean;
}

export class Outlet<T> implements IOutlet<T> {
    private _plucked = false;
    private _completed = false;

    get plucked() { return this._plucked; }
    get completed() { return this._completed; }
    
    constructor(private outlet: IOutlet<T>) {
    }

    
    static to<T>(next: (value: T) => void, err?: (err: Error) => void): Outlet<T> {
        return new Outlet({ next, error: err });
    }

    static throughTo<T, K>(fn: (value: T, outlet: Outlet<K>) => void, outlet: Outlet<K>): Outlet<T> {
        return new Outlet<T>({
            async next(value: T) {
                return fn(value, outlet);
            },
            complete: () => outlet.complete(),
            error: err => outlet.error(err)
        });
    }

    static suppressReturn<T>(sink: Outlet<T>): Outlet<T> {
        return new Outlet<T>({
            next: val => sink.next(val),
            complete: () => {},
            error: err => sink.error(err)
        });
    }

    next(value: T): MaybePromise<void> {
        if (!this._completed && !this._plucked) {
            return this.outlet.next(value);
        }
    }

    complete(): MaybePromise<void> {
        this._completed = true;
        if (this.outlet.complete && !this._plucked) {
            return this.outlet.complete();
        }
    }

    error(error: Error): MaybePromise<void> {
        if (this.outlet.error && !this._plucked && !this._completed) {
            return this.outlet.error(error);
        }
    }

    pluck() {
        this._plucked = true;
        if (this.outlet.pluck && !this.outlet.plucked) {
            return this.outlet.pluck();
        }
    }
}