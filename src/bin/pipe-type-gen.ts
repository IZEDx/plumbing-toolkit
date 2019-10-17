
import { promises } from "fs";
import { join } from "path";

function range(start = 0, to = 100, step = 1)
{
    const list = [] as number[];
    for (let i = start; i <= to; i+=step)
    {
        list.push(i);
    }
    return list;
} 


export async function genPipeTypes()
{
    return promises.writeFile(join(__dirname, "..", "src", "pipe-types.ts"), `
import { Outlet } from "./outlet";

export type Pluck = () => void;
export type Spring<T> = (outlet: Outlet<T>) => Pluck;
export type Operator<T, K = T, R = IPipe<K>> = (input: IPipe<T>) => R;
export type Op<T, K = T, R = IPipe<K>> = Operator<T, K, R>;


export interface IPipe<_> {
    pipe<K, R = IPipe<K>>(op: Op<_, K, R>): ReturnType<Op<_, K, R>>;
    flush(outlet: Outlet<_>): Pluck;

    ${range(0, 42).map(genChain).join("\n    ")}
}
    `);
}

function genChain(c: number)
{
    if (c <= 0) return `chain<Out = IPipe<any>>(...ops: Op<any>[]): Out`;
    return `chain<${genTypeParamsRec(c)}, Out = IPipe<T${c}>>(${genArgs(c)}): Out;`
}

function genTypeParamsRec(c: number): string
{
    if (c === 1) return "T1"
    return `${genTypeParamsRec(c - 1)}, T${c}`
}

function genArgs(c: number)
{
    if (c === 1) return `op1: Op<_, T1, Out>`
    return `${genArgsRec(c - 1)} op${c}: Op<T${c - 1}, T${c}, Out>`;
}

function genArgsRec(c: number): string
{
    if (c === 1) return `op1: Op<_, T1>, `;
    return `${genArgsRec(c - 1)} op${c}: Op<T${c - 1}, T${c}>, `;
}

genPipeTypes();