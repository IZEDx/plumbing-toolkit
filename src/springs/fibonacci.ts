import { Spring, pump } from "..";

/**
 * Creates a [Spring], that emits the fibonacci sequence for the given [iterations]
 * @param steps 
 */
export function fibonacci(iterations?: number): Spring<number> {
    return pump(fibonacciGenerator(iterations)); 
}

function* fibonacciGenerator(iterations?: number) {
    let lastn = 0;
    let n = 1;

    for (let i = 0; !iterations || i < iterations; i++) {
        yield n;
        [lastn, n] = [n, lastn + n];
    }
}