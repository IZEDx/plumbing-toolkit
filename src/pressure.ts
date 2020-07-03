
export type Pressure<T = any> = () => Promise<T>
export type PressureWithCancel<T = any> = () => 
{
    promise: Promise<T>;
    cancel: () => void;
}

export function immediate() {
    return timeout(0);
}

export function immediateWithCancel() {
    return timeoutWithCancel(0);
}

export function timeout(ms: number) {
    return timeoutWithCancel(ms).promise;
}
export function timeoutWithCancel(ms: number) {
    let handle: any;
    const result =  {
        promise: new Promise<void>( resolve => handle = setTimeout(resolve, ms) ),
        cancel: () => {
            clearTimeout(handle);
            delete result.promise;
        }

    }
    return result;
}

export function animationFrame() {
    return animationFrameWithCancel().promise;
}
export function animationFrameWithCancel() {
    let handle: any;
    const result =  {
        promise: new Promise<number>( resolve => handle = requestAnimationFrame(resolve) ),
        cancel: () => {
            cancelAnimationFrame(handle);
            delete result.promise;
        }

    }
    return result;
}