# Plumbing Toolkit

[![Build Status](https://travis-ci.org/IZEDx/plumbing-toolkit.svg?branch=master)](https://travis-ci.org/IZEDx/plumbing-toolkit)
[![npm version](https://badge.fury.io/js/plumbing-toolkit.svg)](https://badge.fury.io/js/plumbing-toolkit)

### Pluggable and pluckable typesafe asynchronous streams. 

### A modular observable approach using plumber terminology to better conceptualize the data flow.

## Examples

```TypeScript
let c = 0;
pipe(fibonacci(20))
    .pipe( context(0) )
    .pipe( forEach(_ => _.context++) )
    .pipe( filter(_ => _.value % 2 == 0) )
    .pipe( map(_ => `${p.context}: ${p.value}`) )
    .pipe( consume(console.log) );
```
Prints out
```
3: 2
6: 8
9: 34
12: 144
15: 610
18: 2584
```

There is also a chaining method, so this example could also be written as

```TypeScript
pipe(fibonacci(20)).chain(
    context(0),
    forEach(p => p.context++),
    filter(p => p.value % 2 == 0),
    map(p => `${p.context}: ${p.value}`),
    consume(console.log)
)
```

The chain method is also typed for up to 42 arguments, if that's not enough then it's also possible to chain the chains.

## Installation

Simply via npm
```
$ npm i plumbing-toolkit
```

## Concepts

### Pipe

A pipe is the central object in plumbing-toolkit, it is created using a [spring](#spring) and can be piped into an [operator](#operator) or flushed into an [outlet](#outlet).

```TypeScript
declare class Pipe<T> implements IPipe<T> {
    constructor(spring: Spring<T>);
    pipe<K, R = Pipe<K>>(operator: Operator<T, K, R>): ReturnType<Operator<T, K, R>>;
    flush(outlet: Outlet<T>): () => void;
    chain(...operators: Operator<any>[]): any; // The arguments are typed in IPipe<T>
}
```

A pipe can be created using the pipe() function


```TypeScript
import { pipe, range } from "plumbing-toolkit";

const myPipe = pipe(range(0, 10)); // Pipe<number>
```

### Spring

A spring is a function that takes an [outlet](#outlet) and returns a [pluck](#pluck). When called, the spring emits values into the outlet until it is plucked using the pluck.

They typically have the format

```TypeScript
export type Spring<T> = (outlet: Outlet<T>) => Pluck;

```

And usually come as closures like so

```TypeScript
export function interval(ms: number): Spring<number> {
    return (outlet: Outlet<number>) => {
        let i = 0;
        const handle = setInterval(() => outlet.next(i++), ms);
        return () => clearInterval(handle); // return the pluck
    }
}
```


### Operator

While springs provide data and pipes transport data, operators are the ones, that actually work (or operate) on the data, for example by filtering, mapping or transforming the data.
An operator is usually a function that takes a [pipe](#pipe) and returns a pipe. 

They typically have the format
```TypeScript
export type Operator<In, Out = In, Returns = IPipe<Out>> = (input: IPipe<In>) => Returns;
```
The most basic operator is an operator that returns a pipe of the same type, like the filter() operator.

However in plumbing-toolkit an operator is not limited to returning another pipe, even though that is the common usecase.

They are also used to provide endpoints for the pipes. For example the first() operator flushes the pipe it is passed into an outlet and then it returns the first value it receives and plucks the pipe.

```TypeScript
const firstValue = await pipe(from(["foo", "bar", "baz"])).pipe(first())
console.log(firstValue); // foo
```

### Outlet

An outlet is the receiving end of [pipes](#pipe) or [springs](#spring) and usually provides three methods: next(), complete() and error().
Upon flush, the outlet receives values via next(), until the spring is completed at which point complete() is called. If an error occured anywhere in the chain, it will be passed to error().

When the spring or any other outlet above it in the chain is plucked, the outlet will also have the property "plucked" set to true.

```TypeScript
export interface IOutlet<T> {
    next(value: T): MaybePromise<void>;
    error?(error: Error): MaybePromise<void>;
    complete?(): MaybePromise<void>;
    pluck?(): MaybePromise<void>;
    plucked?: boolean;
}
```

This is the outlet interface, it is implemented by the outlet class that provides guaranteed availability of each of those methods.

In day to day business you'll usually never have to manually instantiate an outlet as most usecases are already wrapped nicely in operators and outlet factory methods.

### Pluck

A pluck is a simple function that plucks a spring, as in cancels it. It is returned by the spring and passed down the chain.

It can be accessed via flushing the pipe into an outlet or piping it into the consume operator

```TypeScript
const myPipe = pipe(interval(1000)); 
const pluck = myPipe.flush(Outlet.to(console.log)) // or myPipe.pipe(consume(console.log))
setTimeout(pluck, 5000); // stop the interval after 5 seconds
```

In fact, the consume operator is implemented just like that

```TypeScript
export function consume<T>(consumer: ConsumerFn<T>): Operator<T, T, Pluck>
{
    return input => input.flush( Outlet.to(consumer) );
}
```