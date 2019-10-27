import { MaybePromise } from "./utils";

export interface IOutlet<T> {
    next(value: T): MaybePromise<void>;
    error?(error: Error): MaybePromise<void>;
    complete?(): MaybePromise<void>;
    pluck?(): MaybePromise<void>;
    plucked?: boolean;
}

export interface IDrainable<T> extends AsyncIterable<T> {
    drain(): Promise<IteratorResult<T>>;
}

export class Outlet<T> implements IOutlet<T> {
    private _plucked = false;
    private _completed = false;

    get plucked() { return this._plucked; }
    get completed() { return this._completed; }
    
    constructor(private outlet: IOutlet<T>) {
        this.next = this.next.bind(this);
        this.complete = this.complete.bind(this);
        this.error = this.error.bind(this);
        this.pluck = this.pluck.bind(this);
    }

    
    static to<T>(next: (value: T) => MaybePromise<void>, err?: (err: Error) => MaybePromise<void>): Outlet<T> {
        return new Outlet({ next, error: err });
    }

    static throughTo<T, K>(fn: (value: T, outlet: Outlet<K>) => MaybePromise<void>, outlet: Outlet<K>): Outlet<T> {
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
            try {
                return this.outlet.next(value);
            } catch(e) {
                this.error(e);
            }
        }
    }

    complete(): MaybePromise<void> {
        this._completed = true;
        if (this.outlet.complete && !this._plucked) {
            return this.outlet.complete();
        }
    }

    error(error: Error): MaybePromise<void> {
        if (!this._plucked && !this._completed) {
            if (this.outlet.error) {
                return this.outlet.error(error);
            } else {
                throw error;
            }
        }
    }

    pluck() {
        this._plucked = true;
        if (this.outlet.pluck && !this.outlet.plucked) {
            return this.outlet.pluck();
        }
    }
}