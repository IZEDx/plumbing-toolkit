
import { Sink, Optional } from ".";

// TODO: pluck correctly
export class Tank<T> extends Sink<T> {
    private _waitingNext: ((data: Optional<IteratorResult<T>>) => void)[] = [];
    private _waitingError: ((err: Error) => void)[] = [];
    private _resultQueue: Optional<IteratorResult<T>>[] = [];
    private _thrownError: Error|undefined;
    private _done = false;
    private _started = false;

    get thrownError() {
        return this._thrownError;
    }
    get empty() {
        return this._done;
    }
    get flowing() {
        return this._started;
    }

    constructor() {
        super({
            next: (value: T) => {
                if (!this._started) this._started = true;
                if (this._done) return;

                if (this._waitingNext.length === 0) {
                    this._resultQueue.push({value, done: false});
                } else {
                    this._waitingNext.forEach(fn => fn({value, done: false}));
                    this._waitingNext = [];
                    this._waitingError = [];
                }
            },
            return: () => {
                if (!this._started) this._started = true;
                if (this._done) return;
                this._done = true;

                if (this._waitingNext.length === 0) {
                    this._resultQueue.push({done: true});
                } else {
                    this._waitingNext.forEach(fn => fn({done: true}));
                }
            },
            throw: (err: Error) => {
                if (!this._started) this._started = true;
                if (this._done) return;
                this._done = true;
                this._thrownError = err;
                this._waitingError.forEach(fn => fn(err));
            }
        });
    }

    pump(): Promise<IteratorResult<T>> {
        return new Promise<IteratorResult<T>>((resolve, reject) => {
            if (this._resultQueue.length !== 0) {
                resolve(this._resultQueue[0] as IteratorResult<T>);
                this._resultQueue.splice(0, 1);
            } else if (!this._done) {
                this._waitingNext.push(data => resolve(data as IteratorResult<T>));
                this._waitingError.push(reject);
            } else if (this._thrownError) {
                reject(this._thrownError);
            } else {
                resolve({done: true} as IteratorResult<T>);
            } 
        });
    }
}