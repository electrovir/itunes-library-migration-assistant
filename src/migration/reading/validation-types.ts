import {ParsedLibrary, ParsedPlaylist, ParsedPlaylistItem, ParsedTrack} from './parsed-types';

type AcceptableTypeStrings =
    | 'bigint'
    | 'boolean'
    | 'function'
    | 'number'
    | 'object'
    | 'string'
    | 'symbol'
    | 'undefined'

    // special types
    | 'Buffer'
    | 'Date';

export type ValidationTypes<KeySource> = Readonly<
    Record<keyof KeySource, {type: AcceptableTypeStrings; required: boolean}>
>;

/** The following objects are used for validation purposes */
export const parsedLibraryTypes: ValidationTypes<ParsedLibrary> = {
    'Application Version': {
        required: true,
        type: 'string',
    },
    Date: {
        required: true,
        type: 'Date',
    },
    Features: {
        required: true,
        type: 'number',
    },
    'Library Persistent ID': {
        required: true,
        type: 'string',
    },
    'Major Version': {
        required: true,
        type: 'number',
    },
    'Minor Version': {
        required: true,
        type: 'number',
    },
    'Music Folder': {
        required: true,
        type: 'string',
    },
    Playlists: {
        required: true,
        type: 'object',
    },
    'Show Content Ratings': {
        required: true,
        type: 'boolean',
    },
    Tracks: {
        required: true,
        type: 'object',
    },
};

export const parsedTrackTypes: ValidationTypes<ParsedTrack> = {
    Album: {
        required: false,
        type: 'string',
    },
    'Album Artist': {
        required: false,
        type: 'string',
    },
    'Album Rating': {
        required: false,
        type: 'number',
    },
    'Album Rating Computed': {
        required: false,
        type: 'boolean',
    },
    Artist: {
        required: false,
        type: 'string',
    },
    'Artwork Count': {
        required: false,
        type: 'number',
    },
    'Bit Rate': {
        required: false,
        type: 'number',
    },
    BPM: {
        required: false,
        type: 'number',
    },
    Clean: {
        required: false,
        type: 'boolean',
    },
    Comments: {
        required: false,
        type: 'string',
    },
    Compilation: {
        required: false,
        type: 'boolean',
    },
    Composer: {
        required: false,
        type: 'string',
    },
    'Content Rating': {
        required: false,
        type: 'string',
    },
    'Date Added': {
        required: true,
        type: 'Date',
    },
    'Date Modified': {
        required: false,
        type: 'Date',
    },
    Disabled: {
        required: false,
        type: 'boolean',
    },
    'Disc Count': {
        required: false,
        type: 'number',
    },
    'Disc Number': {
        required: false,
        type: 'number',
    },
    Episode: {
        required: false,
        type: 'string',
    },
    'Episode Order': {
        required: false,
        type: 'number',
    },
    Equalizer: {
        required: false,
        type: 'string',
    },
    Explicit: {
        required: false,
        type: 'boolean',
    },
    'File Folder Count': {
        required: false,
        type: 'number',
    },
    'File Type': {
        required: false,
        type: 'number',
    },
    Genre: {
        required: false,
        type: 'string',
    },
    Grouping: {
        required: false,
        type: 'string',
    },
    'Has Video': {
        required: false,
        type: 'boolean',
    },
    Kind: {
        required: false,
        type: 'string',
    },
    'Library Folder Count': {
        required: false,
        type: 'number',
    },
    Location: {
        required: false,
        type: 'string',
    },
    Loved: {
        required: false,
        type: 'boolean',
    },
    Movie: {
        required: false,
        type: 'boolean',
    },
    'Music Video': {
        required: false,
        type: 'boolean',
    },
    Name: {
        required: true,
        type: 'string',
    },
    'Part Of Gapless Album': {
        required: false,
        type: 'boolean',
    },
    'Persistent ID': {
        required: true,
        type: 'string',
    },
    'Play Count': {
        required: false,
        type: 'number',
    },
    'Play Date': {
        required: false,
        type: 'number',
    },
    'Play Date UTC': {
        required: false,
        type: 'Date',
    },
    Podcast: {
        required: false,
        type: 'boolean',
    },
    Protected: {
        required: false,
        type: 'boolean',
    },
    Purchased: {
        required: false,
        type: 'boolean',
    },
    Rating: {
        required: false,
        type: 'number',
    },
    'Rating Computed': {
        required: false,
        type: 'boolean',
    },
    'Release Date': {
        required: false,
        type: 'Date',
    },
    'Sample Rate': {
        required: false,
        type: 'number',
    },
    Season: {
        required: false,
        type: 'number',
    },
    Series: {
        required: false,
        type: 'string',
    },
    Size: {
        required: false,
        type: 'number',
    },
    'Skip Count': {
        required: false,
        type: 'number',
    },
    'Skip Date': {
        required: false,
        type: 'Date',
    },
    'Sort Album': {
        required: false,
        type: 'string',
    },
    'Sort Album Artist': {
        required: false,
        type: 'string',
    },
    'Sort Artist': {
        required: false,
        type: 'string',
    },
    'Sort Composer': {
        required: false,
        type: 'string',
    },
    'Sort Name': {
        required: false,
        type: 'string',
    },
    'Sort Series': {
        required: false,
        type: 'string',
    },
    'Start Time': {
        required: false,
        type: 'number',
    },
    'Stop Time': {
        required: false,
        type: 'number',
    },
    'Total Time': {
        required: false,
        type: 'number',
    },
    'Track Count': {
        required: false,
        type: 'number',
    },
    'Track ID': {
        required: true,
        type: 'number',
    },
    'Track Number': {
        required: false,
        type: 'number',
    },
    'Track Type': {
        required: true,
        type: 'string',
    },
    'TV Show': {
        required: false,
        type: 'boolean',
    },
    Unplayed: {
        required: false,
        type: 'boolean',
    },
    'Volume Adjustment': {
        required: false,
        type: 'number',
    },
    Work: {
        required: false,
        type: 'string',
    },
    Year: {
        required: false,
        type: 'number',
    },
};

export const parsedPlaylistItemTypes: ValidationTypes<ParsedPlaylistItem> = {
    'Track ID': {
        required: true,
        type: 'number',
    },
};

export const parsedPlaylistTypes: ValidationTypes<ParsedPlaylist> = {
    'All Items': {
        required: true,
        type: 'boolean',
    },
    Audiobooks: {
        required: false,
        type: 'boolean',
    },
    'Distinguished Kind': {
        required: false,
        type: 'number',
    },
    Folder: {
        required: false,
        type: 'boolean',
    },
    Master: {
        required: false,
        type: 'boolean',
    },
    Movies: {
        required: false,
        type: 'boolean',
    },
    Music: {
        required: false,
        type: 'boolean',
    },
    Name: {
        required: true,
        type: 'string',
    },
    'Parent Persistent ID': {
        required: false,
        type: 'string',
    },
    'Playlist ID': {
        required: true,
        type: 'number',
    },
    'Playlist Items': {
        required: false,
        type: 'object',
    },
    'Playlist Persistent ID': {
        required: true,
        type: 'string',
    },
    'Purchased Music': {
        required: false,
        type: 'boolean',
    },
    'Smart Criteria': {
        required: false,
        type: 'Buffer',
    },
    'Smart Info': {
        required: false,
        type: 'Buffer',
    },
    'TV Shows': {
        required: false,
        type: 'boolean',
    },
    Visible: {
        required: false,
        type: 'boolean',
    },
};
