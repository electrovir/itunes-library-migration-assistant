import {ParsedLibrary, ParsedPlaylist, ParsedPlaylistItem, ParsedTrack} from './parsed-types';

type AcceptableTypeStrings =
    | 'string'
    | 'number'
    | 'bigint'
    | 'boolean'
    | 'symbol'
    | 'undefined'
    | 'object'
    | 'function'
    // special types
    | 'Date'
    | 'Buffer';

export type ValidationTypes<KeySource> = Readonly<
    Record<keyof KeySource, {type: AcceptableTypeStrings; required: boolean}>
>;

/** The following objects are used for validation purposes */
export const parsedLibraryTypes: ValidationTypes<ParsedLibrary> = {
    'Application Version': {
        type: 'string',
        required: true,
    },
    'Library Persistent ID': {
        type: 'string',
        required: true,
    },
    'Major Version': {
        type: 'number',
        required: true,
    },
    'Minor Version': {
        type: 'number',
        required: true,
    },
    'Show Content Ratings': {
        type: 'boolean',
        required: true,
    },
    Date: {
        type: 'Date',
        required: true,
    },
    Features: {
        type: 'number',
        required: true,
    },
    Playlists: {
        type: 'object',
        required: true,
    },
    Tracks: {
        type: 'object',
        required: true,
    },
};

export const parsedTrackTypes: ValidationTypes<ParsedTrack> = {
    'Album Artist': {
        type: 'string',
        required: false,
    },
    'Album Rating Computed': {
        type: 'boolean',
        required: false,
    },
    'Album Rating': {
        type: 'number',
        required: false,
    },
    'Artwork Count': {
        type: 'number',
        required: false,
    },
    'Bit Rate': {
        type: 'number',
        required: false,
    },
    'Date Added': {
        type: 'Date',
        required: true,
    },
    'Date Modified': {
        type: 'Date',
        required: false,
    },
    'Disc Count': {
        type: 'number',
        required: false,
    },
    'Disc Number': {
        type: 'number',
        required: false,
    },
    'File Folder Count': {
        type: 'number',
        required: false,
    },
    'File Type': {
        type: 'number',
        required: false,
    },
    'Library Folder Count': {
        type: 'number',
        required: false,
    },
    'Persistent ID': {
        type: 'string',
        required: true,
    },
    'Play Count': {
        type: 'number',
        required: false,
    },
    'Play Date UTC': {
        type: 'Date',
        required: false,
    },
    'Play Date': {
        type: 'number',
        required: false,
    },
    'Rating Computed': {
        type: 'boolean',
        required: false,
    },
    'Release Date': {
        type: 'Date',
        required: false,
    },
    'Sample Rate': {
        type: 'number',
        required: false,
    },
    'Skip Count': {
        type: 'number',
        required: false,
    },
    'Skip Date': {
        type: 'Date',
        required: false,
    },
    'Total Time': {
        type: 'number',
        required: false,
    },
    'Track Count': {
        type: 'number',
        required: false,
    },
    'Track ID': {
        type: 'number',
        required: true,
    },
    'Track Number': {
        type: 'number',
        required: false,
    },
    'Track Type': {
        type: 'string',
        required: true,
    },
    Album: {
        type: 'string',
        required: false,
    },
    Artist: {
        type: 'string',
        required: false,
    },
    BPM: {
        type: 'number',
        required: false,
    },
    Comments: {
        type: 'string',
        required: false,
    },
    Composer: {
        type: 'string',
        required: false,
    },
    Genre: {
        type: 'string',
        required: false,
    },
    Kind: {
        type: 'string',
        required: false,
    },
    Location: {
        type: 'string',
        required: false,
    },
    Name: {
        type: 'string',
        required: true,
    },
    Protected: {
        type: 'boolean',
        required: false,
    },
    Purchased: {
        type: 'boolean',
        required: false,
    },
    Rating: {
        type: 'number',
        required: false,
    },
    Size: {
        type: 'number',
        required: false,
    },
    Year: {
        type: 'number',
        required: false,
    },
};

export const parsedPlaylistItemTypes: ValidationTypes<ParsedPlaylistItem> = {
    'Track ID': {
        type: 'number',
        required: true,
    },
};

export const parsedPlaylistTypes: ValidationTypes<ParsedPlaylist> = {
    'All Items': {
        type: 'boolean',
        required: true,
    },
    'Distinguished Kind': {
        type: 'number',
        required: false,
    },
    'Playlist ID': {
        type: 'number',
        required: true,
    },
    'Playlist Items': {
        type: 'object',
        required: false,
    },
    'Playlist Persistent ID': {
        type: 'string',
        required: true,
    },
    'Smart Criteria': {
        type: 'Buffer',
        required: false,
    },
    'Smart Info': {
        type: 'Buffer',
        required: false,
    },
    Master: {
        type: 'boolean',
        required: false,
    },
    Name: {
        type: 'string',
        required: true,
    },
    Visible: {
        type: 'boolean',
        required: false,
    },
};
