import * as equal from 'fast-deep-equal';
import {testGroup} from 'test-vir';
import {LibraryMigrationError} from '../errors/library-migration-error';
import {makeNewLibrary} from '../migration/make-new-library';
import {ParsedLibrary} from '../migration/reading/parsed-types';
import {getDummyLibrary} from './get-dummy-library';

testGroup({
    tests: (runTest) => {
        runTest({
            expect: true,
            description: 'library object should not get modified when no replace paths are present',
            test: () => {
                const oldLibrary = getDummyLibrary();

                const newLibrary = makeNewLibrary({
                    oldLibrary,
                    replacePaths: [],
                    checkReplacementPaths: false,
                });
                return equal(newLibrary, oldLibrary);
            },
        });

        runTest({
            expect: true,
            description: 'track location should get modified',
            test: () => {
                const oldLibrary = getDummyLibrary();
                const newLibrary = makeNewLibrary({
                    oldLibrary,
                    replacePaths: [{old: 'sample/path', new: 'new/path'}],
                });

                const location = newLibrary.Tracks['0']?.Location;

                return (
                    !!location && location.includes('new/path') && !location.includes('sample/path')
                );
            },
        });

        // runTest({
        //     expect: true,
        //     description: 'rating calculated should get removed',
        //     test: () => {
        //         const dummyLibrary = getDummyLibrary();
        //         const ratingCalculatedKey = 'Rating Computed' as const;
        //         const albumRatingCalculatedKey = 'Album Rating Computed' as const;

        //         const dummyTrack = dummyLibrary.Tracks['0'];

        //         if (!dummyTrack) {
        //             throw new Error(`dummy track missing`);
        //         }

        //         const oldTrack = {
        //             ...dummyTrack,
        //             Rating: 100,
        //             [ratingCalculatedKey]: true,
        //             [albumRatingCalculatedKey]: true,
        //         };

        //         const oldLibrary: Readonly<ParsedLibrary> = {
        //             ...dummyLibrary,
        //             Tracks: {
        //                 '0': oldTrack,
        //             },
        //         };

        //         const newLibrary = makeNewLibrary({
        //             oldLibrary,
        //             replacePaths: [{old: 'sample/path', new: 'new/path'}],
        //             removeRatingComputed: true,
        //         });

        //         const newTrack = newLibrary.Tracks['0'];

        //         if (!newTrack) {
        //             throw new Error('New track was not found');
        //         }

        //         return (
        //             oldTrack.hasOwnProperty(ratingCalculatedKey) &&
        //             !newTrack.hasOwnProperty(ratingCalculatedKey) &&
        //             oldTrack.hasOwnProperty(albumRatingCalculatedKey) &&
        //             !newTrack.hasOwnProperty(albumRatingCalculatedKey)
        //         );
        //     },
        // });

        function getLibraryWithOtherPaths(): Readonly<ParsedLibrary> {
            const dummyLibrary = getDummyLibrary();

            const oldLibrary: Readonly<ParsedLibrary> = {
                ...dummyLibrary,
                Tracks: {
                    ...dummyLibrary.Tracks,
                    a: {
                        'Date Added': new Date(),
                        'Persistent ID': '0',
                        'Track ID': 0,
                        'Track Type': '',
                        Name: '',
                        Location: 'file:///other/path/to/file/a/the/file.mp3',
                    },
                    b: {
                        'Date Added': new Date(),
                        'Persistent ID': '0',
                        'Track ID': 0,
                        'Track Type': '',
                        Name: '',
                        Location: 'file:///other/path/to/file/b/the/file.mp3',
                    },
                    c: {
                        'Date Added': new Date(),
                        'Persistent ID': '0',
                        'Track ID': 0,
                        'Track Type': '',
                        Name: '',
                        Location: 'file:///other/path/to/file/c/the/file.mp3',
                    },
                },
            };

            return oldLibrary;
        }

        runTest({
            description: 'unmodified locations are reported',
            expectError: {
                errorClass: LibraryMigrationError,
                errorMessage: /^\s*This track location was not replaced/,
            },
            test: () => {
                const oldLibrary = getLibraryWithOtherPaths();

                makeNewLibrary({
                    oldLibrary,
                    replacePaths: [{old: 'sample/path', new: 'new/path'}],
                });
            },
        });

        function failReplacementPathCheck(
            // should default to true in makeNewLibrary
            checkReplacementPaths?: undefined | false,
            checkFiles?: undefined | true,
        ) {
            const oldLibrary = getDummyLibrary();
            makeNewLibrary({
                oldLibrary,
                replacePaths: [
                    {old: 'sample/path', new: 'new/path'},
                    {old: 'gibberish not a real path', new: 'fake path'},
                ],
                checkReplacementPaths,
                checkFiles,
            });
        }

        runTest({
            description: 'unused replacement paths should get reported',
            expectError: {
                errorClass: LibraryMigrationError,
                errorMessage: /^\s*The following replacement was never used/,
            },
            test: () => {
                failReplacementPathCheck();
            },
        });

        runTest({
            description: 'unused replacement paths are ignored when the checks are turned off',
            test: () => {
                failReplacementPathCheck(false);
            },
        });

        runTest({
            description: 'missing files throw error',
            expectError: {
                errorClass: LibraryMigrationError,
                errorMessage: /^\s*Missing file:/,
            },
            test: () => {
                failReplacementPathCheck(false, true);
            },
        });

        runTest({
            expect: true,
            description: 'only track location should get modified',
            test: () => {
                const oldLibrary = getDummyLibrary();
                const newLibrary = makeNewLibrary({
                    oldLibrary,
                    replacePaths: [{old: 'sample/path', new: 'new/path'}],
                });

                const oldTrack = oldLibrary.Tracks['0'];
                if (!oldTrack) {
                    throw new Error('Old track was not defined');
                }
                const newTrack = newLibrary.Tracks['0'];
                if (!newTrack) {
                    throw new Error('New track was not defined');
                }
                // remove locations so we can check equality without it
                delete oldTrack.Location;
                delete newTrack.Location;

                return equal(oldLibrary, newLibrary);
            },
        });

        runTest({
            expect: true,
            description: 'tracks marked for deletion should not be included in output',
            test: () => {
                const dummyLibrary = getDummyLibrary();
                const oldLibrary: Readonly<ParsedLibrary> = {
                    ...dummyLibrary,
                    Tracks: {
                        ...dummyLibrary.Tracks,
                        'time to delete': {
                            'Date Added': new Date(),
                            'Persistent ID': '0',
                            'Track ID': 0,
                            'Track Type': '',
                            Name: '',
                            Location: 'file:///something/else/path.mp3',
                        },
                    },
                };

                const newLibrary = makeNewLibrary({
                    oldLibrary,
                    replacePaths: [
                        {
                            old: 'sample/path',
                            new: 'new/path',
                        },
                        {
                            old: 'something/else',
                            delete: true,
                        },
                    ],
                });
                const newTrack = newLibrary.Tracks['0'];
                if (!newTrack) {
                    throw new Error('New track was not defined');
                }

                return !!(
                    Object.keys(newLibrary.Tracks).length && newTrack.Location?.includes('new/path')
                );
            },
        });
    },
});
