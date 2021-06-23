import {existsSync, readFileSync} from 'fs';
import {basename} from 'path';
import {parse, PlistValue} from 'plist';
import {LibraryParseError} from '../../errors/library-parse-error';
import {ParsedLibrary} from './parsed-types';
import {assertValidLibrary} from './validate-library';

export function readLibrary(path: string, loggingEnabled = true): ParsedLibrary {
    if (!existsSync(path)) {
        throw new LibraryParseError(`Library file does not exist: ${path}`);
    }

    let parsedLibrary: Readonly<PlistValue>;

    try {
        loggingEnabled && console.info('Parsing started...');
        parsedLibrary = parse(readFileSync(path).toString());
        loggingEnabled && console.info('Parsing finished');
    } catch (error) {
        if (error instanceof LibraryParseError) {
            throw error;
        } else {
            throw new LibraryParseError(`failed to parse library: ${String(error)}`);
        }
    }

    loggingEnabled && console.info('Validation started...');
    assertValidLibrary(parsedLibrary, basename(path));
    loggingEnabled && console.info('Validation finished');

    return parsedLibrary;
}
