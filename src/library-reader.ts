import {createStream} from 'byline';
import {createReadStream} from 'fs';

export async function readLibrary(path: string, callback?: Function) {
    return new Promise<string[]>((resolve, reject) => {
        const readStream = createReadStream(path);
        const bylineStream = createStream(readStream);
        const lines: string[] = [];

        function triggerRead() {
            const line = bylineStream.read();
            if (line == null) {
                return resolve(lines);
            } else {
                callback && callback(line);
                lines.push(line);
                triggerRead();
            }
        }

        let reading = false;

        bylineStream.on('readable', () => {
            if (reading) {
                return;
            } else {
                reading = true;
            }

            triggerRead();
        });

        bylineStream.on('error', (error) => reject(error));
        readStream.on('error', (error) => reject(error));
    });
}
