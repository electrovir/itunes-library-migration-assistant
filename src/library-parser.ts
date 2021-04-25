import {LibraryParserOptions, ParsedLibrary} from './library-fsm';

const defaultParserOptions: LibraryParserOptions = {
    stream: false,
} as const;

export function parseLibrary(
    filePath: string,
    options: Partial<LibraryParserOptions> = defaultParserOptions,
) {
    if (options.stream) {
        throw new Error('Streaming library parsing is not implemented yet.');
    } else {
        const buildingLibrary: Partial<ParsedLibrary> = {};

        // txmlOutput.forEach();
    }
}
