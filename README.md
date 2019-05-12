# Plumbing Toolkit

[![Build Status](https://travis-ci.org/IZEDx/plumbing-toolkit.svg?branch=master)](https://travis-ci.org/IZEDx/plumbing-toolkit)
[![npm version](https://badge.fury.io/js/plumbing-toolkit.svg)](https://badge.fury.io/js/plumbing-toolkit)

### Pluggable and pluckable typesafe asynchronous streams. (A different approach to observables)

## Examples

```TypeScript
let c = 0;
pipe(fibonacci(20))
    .pipe( forEach(n => c++) )
    .pipe( filter(n => n % 2 == 0) )
    .pipe( map(n => `${c}: ${n}`) )
    .pipe( to(s => console.log(s)) );
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

Most common operators are also present as methods on the pipe class, so this example could also be written as

```TypeScript
let c = 0;
pipe(fibonacci(20))
    .forEach(n => c++)
    .filter(n => n % 2 == 0)
    .map(n => `${c}: ${n}`)
    .to(s => console.log(s));
```

## Concepts

### Pipe

A pipe is the central object in plumbing-toolkit, it is created using a [spring](#spring) and can be piped into an [operator](#operator) or flushed into a [sink](#sink).

### Spring

A spring is a function that takes a [sink](#sink) and returns a [pluck](#pluck). When called, the spring emits values into the sink until it is plucked using the pluck.

### Operator

An operator is usually a function that takes a [pipe](#pipe) and returns a pipe. However in plumbing-toolkit an operator is not limited to returning another pipe, even though that is the common usecase.

When returning another pipe, operators are used to construct pipe chains to compute the data that is going though the pipes.

Operators are then also used to provide endpoints for the pipes. For example the first() operator flushes the pipe it is passed into a sink and then it returns the first value it receives and plucks the pipe.

### Sink

A sink is the receiving end of [pipe](#pipe) or [spring](#spring) and usually provides three methods: next(), return() and throw().
Upon flush, the sink receives values via next(), until the spring is completed at which point return() is called. If an error occured anywhere in the chain, it will be passed to throw().

When the spring or any other sink above it in the chain is plucked, the sink will also have the property "plucked" set to true.

### Pluck

A pluck is a simple function that plucks a spring, as in cancels it. It is returned by the spring and passed down the chain.

