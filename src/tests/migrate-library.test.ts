import * as equal from 'fast-deep-equal';
import {existsSync, unlinkSync} from 'fs';
import {testGroup} from 'test-vir';
import {MigrationOutput} from '../api/api-types';
import {migrateLibrary} from '../migration/migrate-library';
import {readLibraryFile, readLibraryString} from '../migration/reading/read-library';
import {getSampleFilePath} from './file-paths';

testGroup({
    tests: (runTest) => {
        const libraryFilePath = getSampleFilePath('library-example.xml');

        runTest({
            description: 'output file is created',
            test: () => {
                const outputPath = migrateLibrary({
                    libraryFilePath,
                    replacePaths: [],
                    options: {
                        validationEnabled: true,
                        loggingEnabled: true,
                        checkReplacementPaths: false,
                    },
                    outputType: MigrationOutput.WriteToFile,
                }).filePath;

                if (!existsSync(outputPath)) {
                    throw new Error(`Output library file was not created: ${outputPath}`);
                }

                unlinkSync(outputPath);
            },
        });

        runTest({
            description: 'plist is created and valid',
            expect: true,
            test: () => {
                const outputPlist = migrateLibrary({
                    libraryFilePath,
                    replacePaths: [],
                    options: {
                        checkReplacementPaths: false,
                    },
                    outputType: MigrationOutput.PlistString,
                }).plist;

                const parsedLibraryFile = readLibraryFile({libraryFilePath: libraryFilePath});
                const reParsedLibrary = readLibraryString({libraryString: outputPlist});

                return equal(parsedLibraryFile, reParsedLibrary);
            },
        });

        runTest({
            description: 'JSON object is created and valid',
            expect: true,
            test: () => {
                const outputObject = migrateLibrary({
                    libraryFilePath,
                    replacePaths: [],
                    options: {
                        checkReplacementPaths: false,
                    },
                    outputType: MigrationOutput.JsonObject,
                });

                const parsedLibraryFile = readLibraryFile({libraryFilePath: libraryFilePath});

                return equal(parsedLibraryFile, outputObject);
            },
        });

        runTest({
            expect: true,
            description: 'info logging works by default',
            test: () => {
                const infoLogs: string[] = [];

                const oldInfo = console.info;
                console.info = (...args: any[]) => {
                    infoLogs.push(...args);
                };
                try {
                    migrateLibrary({
                        libraryFilePath,
                        replacePaths: [],
                        options: {
                            checkReplacementPaths: false,
                        },
                        outputType: MigrationOutput.JsonObject,
                    });
                } finally {
                    console.info = oldInfo;
                }

                return infoLogs.length > 0;
            },
        });

        runTest({
            expect: 0,
            description: 'logging does not log to console.log, only console.info',
            test: () => {
                const logs: string[] = [];

                const oldLog = console.log;
                console.log = (...args: any[]) => {
                    logs.push(...args);
                };
                try {
                    migrateLibrary({
                        libraryFilePath,
                        replacePaths: [],
                        options: {
                            checkReplacementPaths: false,
                        },
                        outputType: MigrationOutput.JsonObject,
                    });
                } finally {
                    console.log = oldLog;
                }

                return logs.length;
            },
        });

        runTest({
            expect: 0,
            description: 'info logging can be turned off',
            test: () => {
                const infoLogs: string[] = [];

                const oldInfo = console.info;
                console.info = (...args: any[]) => {
                    infoLogs.push(...args);
                };
                try {
                    migrateLibrary({
                        libraryFilePath,
                        replacePaths: [],
                        options: {
                            loggingEnabled: false,
                            checkReplacementPaths: false,
                        },
                        outputType: MigrationOutput.JsonObject,
                    });
                } finally {
                    console.info = oldInfo;
                }

                return infoLogs.length;
            },
        });
    },
});
