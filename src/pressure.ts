
export type Pressure<T = any> = () => Promise<T>

export function immediate() {
    return timeout(0);
}

export function timeout(ms: number) {
    return new Promise<void>( resolve => setTimeout(resolve, ms) );
}

export function animationFrame() {
    return new Promise<number>( resolve => requestAnimationFrame(resolve) );
}