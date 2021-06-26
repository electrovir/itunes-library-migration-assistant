import {existsSync, readFileSync} from 'fs';
import {parse, PlistValue} from 'plist';
import {LibraryParseError} from '../../errors/library-parse-error';
import {ParsedLibrary} from './parsed-types';
import {assertValidLibrary} from './validate-library';

export function readLibraryFile(inputs: {
    libraryFilePath: string;
    loggingEnabled?: boolean;
    validationEnabled?: boolean;
}): Readonly<ParsedLibrary> {
    if (!existsSync(inputs.libraryFilePath)) {
        throw new LibraryParseError(`Library file does not exist: ${inputs.libraryFilePath}`);
    }

    return readLibraryString({
        ...inputs,
        libraryString: readFileSync(inputs.libraryFilePath).toString(),
    });
}

export function readLibraryString({
    libraryString,
    loggingEnabled = true,
    validationEnabled = true,
}: {
    libraryString: string;
    loggingEnabled?: boolean;
    validationEnabled?: boolean;
}): Readonly<ParsedLibrary> {
    let parsedLibrary: Readonly<PlistValue>;

    try {
        loggingEnabled && console.info('Parsing started...');
        parsedLibrary = parse(libraryString);
        loggingEnabled && console.info('Parsing finished');
    } catch (error) {
        if (error instanceof LibraryParseError) {
            throw error;
        } else {
            throw new LibraryParseError(`failed to parse library: ${String(error)}`);
        }
    }

    if (validationEnabled) {
        loggingEnabled && console.info('Validation started...');
        assertValidLibrary(parsedLibrary);
        loggingEnabled && console.info('Validation finished');
        return parsedLibrary;
    } else {
        return parsedLibrary as ParsedLibrary;
    }
}
