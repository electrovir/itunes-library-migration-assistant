import * as equal from 'fast-deep-equal';
import {existsSync, statSync, unlinkSync} from 'fs';
import {testGroup} from 'test-vir';
import {MigrationOutput} from '../api/api-types';
import {outputLibrary} from '../migration/output-library';
import {readLibraryString} from '../migration/reading/read-library';
import {getSampleFilePath} from './file-paths';
import {getDummyLibrary} from './get-dummy-library';

testGroup({
    tests: (runTest) => {
        const libraryFilePath = getSampleFilePath('library-example.xml');

        runTest({
            description: 'original file is not changed',
            expect: true,
            test: () => {
                const newLibrary = getDummyLibrary();

                const originalFileModifiedTime = statSync(libraryFilePath).mtimeMs;

                if (!originalFileModifiedTime) {
                    throw new Error('this system does not support mtime');
                }

                const outputPath = outputLibrary({
                    // libraryFilePath here is not actually the file we read the library from
                    libraryFilePath,
                    newLibrary,
                    outputType: MigrationOutput.WriteToFile,
                }).filePath;

                if (!existsSync(outputPath)) {
                    throw new Error(`Output library file was not created: ${outputPath}`);
                }

                unlinkSync(outputPath);
                return statSync(libraryFilePath).mtimeMs === originalFileModifiedTime;
            },
        });

        runTest({
            description: 'returns identical library for JsonObject',
            expect: true,
            test: () => {
                const newLibrary = getDummyLibrary();

                const outputtedLibrary = outputLibrary({
                    // libraryFilePath here is not actually the file we read the library from
                    libraryFilePath,
                    newLibrary,
                    outputType: MigrationOutput.JsonObject,
                });

                return equal(newLibrary, outputtedLibrary);
            },
        });

        runTest({
            description: 'generated plist can be parsed again',
            expect: true,
            test: () => {
                const newLibrary = getDummyLibrary();

                const plistString = outputLibrary({
                    // libraryFilePath here is not actually the file we read the library from
                    libraryFilePath,
                    newLibrary,
                    outputType: MigrationOutput.PlistString,
                }).plist;

                const reParsedLibrary = readLibraryString({libraryString: plistString});

                return equal(newLibrary, reParsedLibrary);
            },
        });
    },
});
