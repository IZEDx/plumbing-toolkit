import { Readable } from "stream";
import { Spring } from "../pipe-types";

export function read<T>(stream: Readable): Spring<T> {
    return outlet => {
        const chunks = [] as any[];
        let completed = false;
        stream.on("data", chunk => chunks.push(chunk));
        stream.once("end", () => completed = true);
        stream.once("close", () => completed = true);
        stream.once("error", err => {
            completed = true;
            outlet.error(err);
        });
        
        (async () => {
            while(!outlet.plucked && (!completed || chunks.length > 0)) {
                if (chunks.length > 0)
                {
                    await outlet.next(chunks.splice(0, 1)[0]);
                }
            }
            outlet.complete();
        })();

        return () => {
            stream.destroy();
        }
    }
}
