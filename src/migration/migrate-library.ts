import {defaultOptions, MigrationApiInput, MigrationOutput} from '../api/api-types';
import {makeNewLibrary} from './make-new-library';
import {outputLibrary} from './output-library';
import {ParsedLibrary} from './reading/parsed-types';
import {readLibraryFile} from './reading/read-library';

export function migrateLibrary({
    libraryFilePath,
    replacePaths,
    outputType,
    options: rawOptions,
    extraTrackProcessing,
}: MigrationApiInput<MigrationOutput.JsonObject>): ParsedLibrary;
export function migrateLibrary({
    libraryFilePath,
    replacePaths,
    outputType,
    options: rawOptions,
    extraTrackProcessing,
}: MigrationApiInput<MigrationOutput.WriteToFile>): {filePath: string};
export function migrateLibrary({
    libraryFilePath,
    replacePaths,
    outputType,
    options: rawOptions,
    extraTrackProcessing,
}: MigrationApiInput<MigrationOutput.PlistString>): {plist: string};
export function migrateLibrary({
    libraryFilePath,
    replacePaths,
    outputType,
    options: rawOptions,
    extraTrackProcessing,
}: MigrationApiInput): {filePath: string} | {plist: string} | ParsedLibrary;
export function migrateLibrary({
    libraryFilePath,
    replacePaths,
    outputType = MigrationOutput.WriteToFile,
    options: rawOptions = defaultOptions,
    extraTrackProcessing,
}: MigrationApiInput): {filePath: string} | {plist: string} | ParsedLibrary {
    const options = {...defaultOptions, ...rawOptions};

    const oldLibrary = readLibraryFile({
        libraryFilePath: libraryFilePath,
        ...options,
    });

    const newLibrary = makeNewLibrary({
        oldLibrary,
        replacePaths,
        extraTrackProcessing,
        ...options,
    });

    return outputLibrary({
        libraryFilePath,
        newLibrary,
        outputType,
        ...options,
    });
}
