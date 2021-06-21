import {LibraryValidationError} from '../errors/library-validation-error';

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
    'Album Artist': string;
    'Album Rating Computed': boolean;
    'Album Rating': number;
    'Bit Rate': number;
    'Date Added': string;
    'Date Modified': string;

    'Disc Number'?: number;
    'Disc Count'?: number;
    'Track Number'?: number;
    'Track Count'?: number;
    'Release Date'?: Date;
    'Artwork Count'?: number;
    Protected?: boolean;
    Purchased?: boolean;
    Comments?: string;

    'File Folder Count': number;
    'File Type': number;
    'Library Folder Count': number;
    'Persistent ID': string;
    'Play Count': number;
    'Play Date UTC': string;
    'Play Date': number;
    'Rating Computed'?: boolean;
    'Sample Rate': number;
    'Skip Count': number;
    'Skip Date': string;
    'Total Time': number;
    'Track ID': number;
    'Track Type': string;
    Album: string;
    Artist: string;
    BPM: number;
    Composer: string;
    Genre: string;
    Kind: string;
    Location: string;
    Name: string;
    Rating: number;
    Size: number;
    Year: number;
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

    'Disc Number': 'number',
    'Disc Count': 'number',
    'Track Number': 'number',
    'Track Count': 'number',
    'Release Date': 'Date',
    'Artwork Count': 'number',
    Protected: 'boolean',
    Purchased: 'boolean',
    Comments: 'string',

    'Bit Rate': 'number',
    'Sample Rate': 'number',
    'Play Count': 'number',
    'Play Date': 'number',
    'Play Date UTC': 'Date',
    'Skip Count': 'number',
    'Skip Date': 'Date',
    Rating: 'number',
    'Rating Computed': 'boolean',
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
    'Smart Criteria': 'Buffer',
    'Smart Info': 'Buffer',
    Master: 'boolean',
    Name: 'string',
    Visible: 'boolean',
};

type ValidationBasis = {
    types: Record<string, string>;
    subTypes?: Record<string, ValidationBasis>;
};

function assertObjectFromTypes<T extends object>(
    name: string,
    input: unknown,
    validationBasis: ValidationBasis,
    nameTree: string[],
): asserts input is T {
    if (input === undefined) {
        throw new LibraryValidationError(`${name} does not exist.`, nameTree.concat(name));
    }

    if (typeof input !== 'object' || !input) {
        throw new LibraryValidationError(
            `${name} is not an object: ${input}`,
            nameTree.concat(name),
        );
    }

    const invalidKeys = Object.keys(input).filter((libraryKey) => {
        const value: any = (input as any)[libraryKey];
        if (validationBasis.types[libraryKey] === 'Date') {
            if (!(value instanceof Date)) {
                return true;
            }
        } else if (validationBasis.types[libraryKey] === 'Buffer') {
            if (!(value instanceof Buffer)) {
                return true;
            }
        } else if (typeof value !== validationBasis.types[libraryKey]) {
            return true;
        }

        if (validationBasis.types[libraryKey] === 'object') {
            const subValidation = validationBasis.subTypes?.[libraryKey];
            if (subValidation) {
                Object.keys(value).forEach((subKey) => {
                    const subValue = value[subKey];
                    assertObjectFromTypes(
                        libraryKey,
                        subValue,
                        subValidation,
                        nameTree.concat(name),
                    );
                });
            } else {
                throw new Error(`Missing validation basis for ${libraryKey} key in ${name}`);
            }
        }

        return false;
    });

    const missingKeys = Object.keys(validationBasis.types).filter((validationKey) => {
        return !(validationKey in input);
    });

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
    const invalidKeysMessage = invalidKeys.length
        ? `Invalid ${name} keys:\n${JSON.stringify(invalidValues, null, 4)}`
        : '';
    const missingKeysMessage = missingKeys.length ? `Missing keys:${missingKeys.join(', ')}` : '';

    if (invalidKeys.length || missingKeys.length) {
        const separator = invalidKeys.length && missingKeys.length ? '\n' : '';
        throw new LibraryValidationError(
            `${invalidKeysMessage}${separator}${missingKeysMessage}`,
            nameTree.concat(name),
        );
    }
}

export function assertValidLibrary(
    parsedLibrary: any,
    fileName: string,
): asserts parsedLibrary is ParsedLibrary {
    assertObjectFromTypes<ParsedLibrary>(
        fileName,
        parsedLibrary,
        {
            types: parsedLibraryTypes,
            subTypes: {
                Tracks: {types: parsedTrackTypes},
                Playlists: {
                    types: parsedPlaylistTypes,
                    subTypes: {
                        'Playlist Items': {types: parsedPlaylistItemTypes},
                    },
                },
            },
        },
        [],
    );
}
