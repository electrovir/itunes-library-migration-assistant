import {existsSync, readFileSync} from 'fs';
import {parse} from 'plist';
import {LibraryParseError} from '../errors/library-parse-error';
import {assertsValidLibrary, ParsedLibrary} from './parsed-types';

export function readLibrary(path: string): ParsedLibrary {
    if (!existsSync(path)) {
        throw new LibraryParseError(`Library file does not exist: ${path}`);
    }
    try {
        const parsedLibrary = parse(readFileSync(path).toString());
        assertsValidLibrary(parsedLibrary);
        return parsedLibrary as any;
    } catch (error) {
        if (error instanceof LibraryParseError) {
            throw error;
        } else {
            throw new LibraryParseError(`failed to parse library: ${String(error)}`);
        }
    }
}
