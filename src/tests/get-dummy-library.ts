import {ParsedLibrary} from '../migration/reading/parsed-types';

export function getDummyLibrary(): ParsedLibrary {
    const dummyDate = new Date();
    // milliseconds apparently aren't encoded into the plist dates
    dummyDate.setMilliseconds(0);

    return {
        'Application Version': '',
        'Library Persistent ID': '',
        'Major Version': 0,
        'Minor Version': 0,
        'Music Folder': '',
        'Show Content Ratings': false,
        Date: dummyDate,
        Features: 0,
        Playlists: [],
        Tracks: {
            '0': {
                'Date Added': dummyDate,
                'Persistent ID': '0',
                'Track ID': 0,
                'Track Type': '',
                Name: '',
                Location: 'file:///sample/path.mp3',
            },
        },
    };
}
