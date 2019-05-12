import { MaybePromise } from ".";

export interface ISink<T> {
    next(value: T): MaybePromise<void>;
    throw?(error: Error): MaybePromise<void>;
    return?(): MaybePromise<void>;
    pluck?(): MaybePromise<void>;
    plucked?: boolean;
}

export class Sink<T> implements ISink<T> {
    private _plucked = false;
    private _completed = false;

    get plucked() { return this._plucked; }
    get completed() { return this._completed; }
    
    constructor(private sink: ISink<T>) {
    }

    
    static to<T>(next: (value: T) => void, err?: (err: Error) => void): Sink<T> {
        return new Sink({ next, throw: err });
    }

    static throughTo<T, K>(fn: (value: T, sink: Sink<K>) => void, sink: Sink<K>): Sink<T> {
        return new Sink<T>({
            async next(value: T) {
                return fn(value, sink);
            },
            return: () => sink.return(),
            throw: err => sink.throw(err)
        });
    }

    static suppresReturn<T>(sink: Sink<T>): Sink<T> {
        return new Sink<T>({
            next: val => sink.next(val),
            return: () => {},
            throw: err => sink.throw(err)
        });
    }

    next(value: T): MaybePromise<void> {
        if (!this._completed && !this._plucked) {
            return this.sink.next(value);
        }
    }

    return(): MaybePromise<void> {
        this._completed = true;
        if (this.sink.return && !this._plucked) {
            return this.sink.return();
        }
    }

    throw(error: Error): MaybePromise<void> {
        if (this.sink.throw && !this._plucked && !this._completed) {
            return this.sink.throw(error);
        }
    }

    pluck() {
        this._plucked = true;
        if (this.sink.pluck && !this.sink.plucked) {
            return this.sink.pluck();
        }
    }
}