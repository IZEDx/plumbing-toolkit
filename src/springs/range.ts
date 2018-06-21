import { Spring, pump } from "..";

export function range(from: number, to?: number, step = 1): Spring<number> {
    return pump(rangeGenerator(from, to, step)); 
}

function* rangeGenerator(from: number, to?: number, step = 1) {
    for (let i = from; !to || i < to; i += step) {
        yield i;
    }
}