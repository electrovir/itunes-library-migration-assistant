import {writeFileSync} from 'fs';
import {extname} from 'path';
import {build} from 'plist';
import {MigrationOutput} from '../api/api-types';
import {InvalidApiInputError} from '../errors/invalid-api-input-error';
import {ParsedLibrary} from './reading/parsed-types';

export function outputLibrary({
    libraryFile,
    newLibrary,
    outputType,
    loggingEnabled = true,
}: {
    libraryFile: string;
    newLibrary: ParsedLibrary;
    outputType: MigrationOutput;
    loggingEnabled?: boolean;
}) {
    if (outputType === MigrationOutput.JsonObject) {
        loggingEnabled && console.info(`Returned JSON object representation of library plist.`);
        return newLibrary;
    }

    loggingEnabled && console.info(`Building plist of new library...`);
    const plistLibrary = build(newLibrary);
    loggingEnabled && console.info(`Building finished`);

    if (outputType === MigrationOutput.PlistString) {
        loggingEnabled && console.info(`Returned JSON object representation of library plist.`);
        return plistLibrary;
    } else if (outputType === MigrationOutput.WriteToFile) {
        const extension = extname(libraryFile);
        const newPath = libraryFile.replace(extension, `.migrated${extension}`);
        loggingEnabled && console.info('Writing new library file...');
        writeFileSync(newPath, plistLibrary);
        loggingEnabled && console.info(`New library written to: ${newPath}`);
    }

    throw new InvalidApiInputError('outputType', 'Unsupported output type.');
}
