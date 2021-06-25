import * as equal from 'fast-deep-equal';
import {testGroup} from 'test-vir';
import {makeNewLibrary} from '../migration/make-new-library';
import {ParsedLibrary} from '../migration/reading/parsed-types';

testGroup({
    tests: (runTest) => {
        function getMockLibrary(): ParsedLibrary {
            return {
                'Application Version': '',
                'Library Persistent ID': '',
                'Major Version': 0,
                'Minor Version': 0,
                'Music Folder': '',
                'Show Content Ratings': false,
                Date: new Date(),
                Features: 0,
                Playlists: [],
                Tracks: {
                    '0': {
                        'Date Added': new Date(),
                        'Persistent ID': '0',
                        'Track ID': 0,
                        'Track Type': '',
                        Name: '',
                        Location: 'file:///sample/path.mp3',
                    },
                },
            };
        }

        runTest({
            expect: true,
            description: 'library object should not get modified when no tracks are present',
            test: () => {
                const oldLibrary = getMockLibrary();
                const newLibrary = makeNewLibrary({oldLibrary, replacePaths: []});
                return equal(newLibrary, oldLibrary);
            },
        });

        runTest({
            expect: true,
            description: 'track location should get modified',
            test: () => {
                const oldLibrary = getMockLibrary();
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

        runTest({
            expect: true,
            description: 'only track location should get modified',
            test: () => {
                const oldLibrary = getMockLibrary();
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
    },
});
