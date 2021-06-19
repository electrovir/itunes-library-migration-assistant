import {existsSync} from 'fs';
import {parse} from 'plist';

export function readLibrary(path: string) {
    if (!existsSync(path)) {
        throw new Error();
    }
    parse(path);
}
