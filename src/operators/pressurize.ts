import { Pressure } from "../pressure";
import { Operator } from "../pipe-types";
import { collector } from "./endpoints";
import { pipe } from "../pipe";
import { from } from "../springs";

export function pressurize<T>(pressure: Pressure): Operator<T>
{
    return input => {
        const buffer = input.pipe(collector());
        return pipe(from(buffer, pressure));
    }
}
