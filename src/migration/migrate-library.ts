import {defaultOptions, MigrationApiInput, MigrationOutput} from '../api/api-types';
import {makeNewLibrary} from './make-new-library';
import {outputLibrary} from './output-library';
import {readLibrary} from './reading/read-library';

export function migrateLibrary({
    libraryFile,
    replacePaths,
    outputType = MigrationOutput.WriteToFile,
    options: rawOptions = defaultOptions,
}: MigrationApiInput) {
    const options = {...defaultOptions, ...rawOptions};

    const oldLibrary = readLibrary({
        path: libraryFile,
        ...options,
    });

    const newLibrary = makeNewLibrary({
        oldLibrary,
        replacePaths,
        ...options,
    });

    outputLibrary({
        libraryFile,
        newLibrary,
        outputType,
        ...options,
    });
}
