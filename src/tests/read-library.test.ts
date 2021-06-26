import {existsSync} from 'fs';
import {build} from 'plist';
import {testGroup} from 'test-vir';
import {LibraryValidationError} from '../errors/library-validation-error';
import {ParsedLibrary} from '../migration/reading/parsed-types';
import {readLibraryFile, readLibraryString} from '../migration/reading/read-library';
import {getOutputFilePath, getSampleFilePath} from './file-paths';
import {getDummyLibrary} from './get-dummy-library';

testGroup({
    tests: (runTest) => {
        runTest({
            description: 'can read small sample library',
            test: () => {
                readLibraryFile({libraryFilePath: getSampleFilePath('library-example.xml')});
            },
        });

        const testFullLibraryPath = getOutputFilePath('library.xml');

        if (existsSync(testFullLibraryPath)) {
            runTest({
                description: 'can read full library',
                test: () => {
                    readLibraryFile({libraryFilePath: getOutputFilePath('library.xml')});
                },
            });
        } else {
            console.info(
                `Put your library into ${testFullLibraryPath} to test the parser against it`,
            );
        }

        function createInvalidLibraryString(): string {
            const sampleLibrary = getDummyLibrary();

            const sampleTrack = sampleLibrary.Tracks['0'];

            if (!sampleTrack) {
                throw new Error(`Sample track doesn't exist anymore.`);
            }

            const invalidLibrary: Readonly<ParsedLibrary> = {
                ...sampleLibrary,
                Tracks: {
                    g: {
                        ...sampleTrack,
                        // intentionally assign a bad type
                        Name: 32 as unknown as string,
                    },
                },
            };

            return build(invalidLibrary);
        }

        runTest({
            description: 'validation should fail on incorrect type',
            expectError: {
                errorClass: LibraryValidationError,
            },
            test: () => {
                readLibraryString({libraryString: createInvalidLibraryString()});
            },
        });

        runTest({
            description: 'validation is ignored when turned off',
            test: () => {
                readLibraryString({
                    libraryString: createInvalidLibraryString(),
                    validationEnabled: false,
                });
            },
        });
    },
});
