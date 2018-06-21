import { pipe, fibonacci, to } from "./src";

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

pipe( fibonacci(1000) )
    //.pipe( filter(i => i % 2 == 0) )
    //.pipe( map(i => i + 1) )
    .pipe( to(console.log) );