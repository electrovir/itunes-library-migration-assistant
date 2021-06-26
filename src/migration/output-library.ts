import {writeFileSync} from 'fs';
import {extname} from 'path';
import {build} from 'plist';
import {MigrationOutput} from '../api/api-types';
import {InvalidApiInputError} from '../errors/invalid-api-input-error';
import {ParsedLibrary} from './reading/parsed-types';

export function outputLibrary({
    libraryFilePath,
    newLibrary,
    outputType,
    loggingEnabled,
}: {
    libraryFilePath: string;
    newLibrary: ParsedLibrary;
    outputType: MigrationOutput.JsonObject;
    loggingEnabled?: boolean;
}): ParsedLibrary;
export function outputLibrary({
    libraryFilePath,
    newLibrary,
    outputType,
    loggingEnabled,
}: {
    libraryFilePath: string;
    newLibrary: ParsedLibrary;
    outputType: MigrationOutput.WriteToFile;
    loggingEnabled?: boolean;
}): {filePath: string};
export function outputLibrary({
    libraryFilePath,
    newLibrary,
    outputType,
    loggingEnabled,
}: {
    libraryFilePath: string;
    newLibrary: ParsedLibrary;
    outputType: MigrationOutput.PlistString;
    loggingEnabled?: boolean;
}): {plist: string};
export function outputLibrary({
    libraryFilePath,
    newLibrary,
    outputType,
    loggingEnabled,
}: {
    libraryFilePath: string;
    newLibrary: ParsedLibrary;
    outputType: MigrationOutput;
    loggingEnabled?: boolean;
}): {filePath: string} | {plist: string} | ParsedLibrary;
export function outputLibrary({
    libraryFilePath,
    newLibrary,
    outputType,
    loggingEnabled = true,
}: {
    libraryFilePath: string;
    newLibrary: ParsedLibrary;
    outputType: MigrationOutput;
    loggingEnabled?: boolean;
}): {filePath: string} | {plist: string} | ParsedLibrary {
    if (outputType === MigrationOutput.JsonObject) {
        loggingEnabled && console.info(`Returned JSON object representation of library plist.`);
        return newLibrary;
    }

    loggingEnabled && console.info(`Building plist of new library...`);
    const plistLibrary = build(newLibrary);
    loggingEnabled && console.info(`Building finished`);

    if (outputType === MigrationOutput.PlistString) {
        loggingEnabled && console.info(`Returned JSON object representation of library plist.`);
        return {plist: plistLibrary};
    } else if (outputType === MigrationOutput.WriteToFile) {
        const extension = extname(libraryFilePath);
        const newPath = libraryFilePath.replace(extension, `.migrated${extension}`);
        loggingEnabled && console.info('Writing new library file...');
        writeFileSync(newPath, plistLibrary);
        loggingEnabled && console.info(`New library written to: ${newPath}`);
        return {filePath: newPath};
    }

    throw new InvalidApiInputError('outputType', 'Unsupported output type.');
}
