import { pump } from "./from";
import { Spring } from "../pipe";
import { Pressure, immediate } from "../pressure";

/**
 * Creates a [Spring], that emits the fibonacci sequence for the given [iterations]
 * @param steps 
 */
export function fibonacci(iterations?: number, pressure: Pressure = immediate): Spring<number> {
    return pump(fibonacciGenerator(iterations), pressure); 
}

function* fibonacciGenerator(iterations?: number) {
    let lastn = 0;
    let n = 1;

    for (let i = 0; !iterations || i < iterations; i++) {
        yield n;
        [lastn, n] = [n, lastn + n];
    }
}