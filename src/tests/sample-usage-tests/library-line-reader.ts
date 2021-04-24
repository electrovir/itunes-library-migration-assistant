import {createStream} from 'byline';
import {createReadStream} from 'fs';

export async function readLibraryByLine(path: string, callback?: Function) {
    return new Promise<{
        openingTag: string[];
        closingTag: string[];
        selfClosing: string[];
        all: string[];
    }>((resolve, reject) => {
        const readStream = createReadStream(path);
        const bylineStream = createStream(readStream);
        const matches: {
            openingTag: string[];
            closingTag: string[];
            selfClosing: string[];
            all: string[];
        } = {
            openingTag: [],
            closingTag: [],
            selfClosing: [],
            all: [],
        };

        function triggerRead() {
            try {
                const read = bylineStream.read();
                if (read == null) {
                    return resolve(matches);
                } else {
                    const line = read.toString();
                    callback && callback(line);
                    const openingTag = !!line.match(/<(?:[^\/]|$)/);
                    const closingTag = !!line.match(/<\//);
                    const selfClosing = !!line.match(/\/>/);
                    if (openingTag) {
                        matches.openingTag.push(line);
                    }
                    if (closingTag) {
                        matches.closingTag.push(line);
                    }
                    if (selfClosing) {
                        matches.selfClosing.push(line);
                    }
                    matches.all.push(line);
                    triggerRead();
                }
            } catch (error) {
                console.error(error);
                reject(error);
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

        bylineStream.on('error', (error) => {
            console.error(error);
            reject(error);
        });
        readStream.on('error', (error) => {
            console.error(error);
            reject(error);
        });
    });
}
