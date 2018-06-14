import { MaybePromise } from ".";

export namespace Pressure {
    export function immediate<T>(fn: () => MaybePromise<T>) {
        return timeout(0, fn);
    }
    
    export function timeout<T>(ms: number, callback: () => MaybePromise<T>) {
        return pressurize(cb => setTimeout(cb, ms), callback);
    }
    
    export function animationFrame<T>(callback: () => MaybePromise<T>) {
        return pressurize(cb => requestAnimationFrame(time => cb(time)), callback);
    }
    
    
    export async function pressurize<T>(pressurizer: (resolve: Function) => void, callback: () => MaybePromise<T>) {
        return new Promise<T>((resolve, reject) => {
            pressurizer(() => {
                try {
                    const result = callback();
                    if (result instanceof Promise) {
                        result.then(resolve).catch(reject);
                    } else {
                        resolve(result);
                    }
                } catch(err) {
                    reject(err);
                }
            });
        });
    }
}