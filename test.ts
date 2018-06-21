import { pipe, Pipe, fibonacci, map, filter, to } from "./src";

/*
function fetch(): Operator<string, string> {
    return through((url, sink) => {
        get(url, response => {
            let data = "";
            response.on("data", (chunk) => data += chunk);
            response.on("end", () => sink.next(data));
        })
        .on("error", sink.throw);
    });
}*/


const halveEven : (input: Pipe<number>) => Pipe<number>
                = input => input.pipe( filter(i => i % 2 == 0) ).pipe( map(i => i / 2) );

pipe( fibonacci(50) )
    .pipe( halveEven )
    .pipe( to(console.log) );

