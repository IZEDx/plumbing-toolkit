
export function immediate<T>() {
    return timeout(0);
}

export function timeout<T>(ms: number) {
    return new Promise<void>( resolve => setTimeout(resolve, ms) );
}

export function animationFrame<T>() {
    return new Promise<number>( resolve => requestAnimationFrame(resolve) );
}