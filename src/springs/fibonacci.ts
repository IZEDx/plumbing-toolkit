import { Spring, pump } from "..";

export function fibonacci(steps?: number): Spring<number> {
    return pump(fibonacciGenerator(steps)); 
}

async function* fibonacciGenerator(steps?: number) {
    let lastn = 0;
    let n = 1;

    for (let i = 0; !steps || i < steps; i++) {
        yield n;
        [lastn, n] = [n, lastn + n];
    }
}