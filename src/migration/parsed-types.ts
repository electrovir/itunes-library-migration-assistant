import {LibraryParseError} from '../errors/library-parse-error';

export type ParsedPlaylistItem = {
    'Track ID': number;
};

export type ParsedPlaylist = {
    'All Items': boolean;
    'Distinguished Kind': number;
    'Playlist ID': number;
    'Playlist Items': ParsedPlaylistItem[];
    'Playlist Persistent ID': string;
    'Smart Criteria': {
        type: string;
        data: number[];
    };
    'Smart Info': {
        type: string;
        data: number[];
    };
    Master?: boolean;
    Name: string;
    Visible?: boolean;
};

export type ParsedTrack = {
    'Track ID': number;
    Size: number;
    'Total Time': number;
    Year: number;
    BPM: number;
    'Date Modified': string;
    'Date Added': string;
    'Bit Rate': number;
    'Sample Rate': number;
    'Play Count': number;
    'Play Date': number;
    'Play Date UTC': string;
    'Skip Count': number;
    'Skip Date': string;
    Rating: number;
    'Album Rating': number;
    'Album Rating Computed': boolean;
    'Persistent ID': string;
    'Track Type': string;
    'File Type': number;
    'File Folder Count': number;
    'Library Folder Count': number;
    Name: string;
    Artist: string;
    'Album Artist': string;
    Composer: string;
    Album: string;
    Genre: string;
    Kind: string;
    Location: string;
};

export type ParsedLibrary = {
    'Application Version': string;
    'Library Persistent ID': string;
    'Major Version': number;
    'Minor Version': number;
    'Show Content Ratings': boolean;
    Date: string;
    Features: number;
    Playlists: ParsedPlaylist[];
    Tracks: Record<string, ParsedTrack>;
};

/** The following objects are used for validation purposes */
const parsedLibraryTypes: Readonly<Record<keyof ParsedLibrary, string>> = {
    'Application Version': 'string',
    'Library Persistent ID': 'string',
    'Major Version': 'number',
    'Minor Version': 'number',
    'Show Content Ratings': 'boolean',
    Date: 'Date',
    Features: 'number',
    Playlists: 'object',
    Tracks: 'object',
};

const parsedTrackTypes: Readonly<Record<keyof ParsedTrack, string>> = {
    'Track ID': 'number',
    Size: 'number',
    'Total Time': 'number',
    Year: 'number',
    BPM: 'number',
    'Date Modified': 'Date',
    'Date Added': 'Date',
    'Bit Rate': 'number',
    'Sample Rate': 'number',
    'Play Count': 'number',
    'Play Date': 'number',
    'Play Date UTC': 'Date',
    'Skip Count': 'number',
    'Skip Date': 'Date',
    Rating: 'number',
    'Album Rating': 'number',
    'Album Rating Computed': 'boolean',
    'Persistent ID': 'string',
    'Track Type': 'string',
    'File Type': 'number',
    'File Folder Count': 'number',
    'Library Folder Count': 'number',
    Name: 'string',
    Artist: 'string',
    'Album Artist': 'string',
    Composer: 'string',
    Album: 'string',
    Genre: 'string',
    Kind: 'string',
    Location: 'string',
};

export const parsedPlaylistItemTypes: Readonly<Record<keyof ParsedPlaylistItem, string>> = {
    'Track ID': 'number',
};

export const parsedPlaylistTypes: Readonly<Record<keyof ParsedPlaylist, string>> = {
    'All Items': 'boolean',
    'Distinguished Kind': 'number',
    'Playlist ID': 'number',
    'Playlist Items': 'object',
    'Playlist Persistent ID': 'string',
    'Smart Criteria': 'object',
    'Smart Info': 'object',
    Master: 'boolean',
    Name: 'string',
    Visible: 'boolean',
};

export function assertsValidPlaylist(
    parsedPlaylist: any,
): asserts parsedPlaylist is ParsedPlaylist {}

export function assertsValidTrack(parsedTrack: any): asserts parsedTrack is ParsedTrack {}

type ValidationBasis = {
    types: Record<string, string>;
    objectCheckers: Record<string, (input: any) => void>;
};

function assertsObjectFromTypes<T extends object>(
    name: string,
    input: unknown,
    validationBasis: ValidationBasis,
): asserts input is T {
    if (typeof input !== 'object' || !input) {
        throw new LibraryParseError(`${name} is not an object.`);
    }

    const invalidKeys = Object.keys(input).filter((libraryKey) => {
        const value: any = (input as any)[libraryKey];
        if (validationBasis.types[libraryKey] === 'Date') {
            if (!(value instanceof Date)) {
                return true;
            }
        } else if (typeof value !== validationBasis.types[libraryKey]) {
            return true;
        }

        if (validationBasis.types[libraryKey] === 'object') {
            const propertyChecker = validationBasis.objectCheckers[libraryKey];
            if (propertyChecker) {
                propertyChecker(value);
            } else {
                throw new Error(`Missing validation basis for ${libraryKey} key in ${name}`);
            }
        }

        return false;
    });

    if (invalidKeys.length) {
        const invalidValues = invalidKeys.reduce(
            (accum: Record<string, {expected: string | undefined; got: unknown}>, key) => {
                accum[key] = {
                    expected: validationBasis.types[key] || 'undefined',
                    got: typeof (input as any)[key],
                };
                return accum;
            },
            {},
        );
        throw new LibraryParseError(
            `Invalid ${name} keys:\n${JSON.stringify(invalidValues, null, 4)}`,
        );
    }
}

export function assertsValidLibrary(parsedLibrary: any): asserts parsedLibrary is ParsedLibrary {
    assertsObjectFromTypes<ParsedLibrary>('parsed library', parsedLibrary, {
        types: parsedLibraryTypes,
        objectCheckers: {
            Tracks: (tracksRecord: Record<string, ParsedTrack>) => {
                Object.values(tracksRecord).forEach((track) => {
                    assertsObjectFromTypes('Parsed track', track, {
                        types: parsedTrackTypes,
                        objectCheckers: {},
                    });
                });
            },
            Playlists: (playlists: ParsedPlaylist[]) => {
                playlists.forEach((playlist) => {
                    assertsObjectFromTypes('Parsed playlist', playlist, {
                        types: parsedPlaylistTypes,
                        objectCheckers: {
                            'Smart Info': () => {throw new Error('not implemented yet')},
                            'Smart Criteria': () => {throw new Error('not implemented yet'},
                            'Playlist Items': (playlistItems: ParsedPlaylistItem[]) => {
                                playlistItems.forEach((playlistItem) => {
                                    assertsObjectFromTypes('Parsed playlist item', playlistItem, {
                                        types: parsedPlaylistItemTypes,
                                        objectCheckers: {},
                                    });
                                });
                            },
                        },
                    });
                });
            },
        },
    });
}
