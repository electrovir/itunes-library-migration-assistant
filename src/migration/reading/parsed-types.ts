export type ParsedTracks = Record<string, ParsedTrack>;

export type ParsedLibrary = {
    'Application Version': string;
    Date: Readonly<Date>;
    Features: number;
    'Library Persistent ID': string;
    'Major Version': number;
    'Minor Version': number;
    'Music Folder': string;
    Playlists: Readonly<Readonly<ParsedPlaylist>[]>;
    'Show Content Ratings': boolean;
    Tracks: Readonly<ParsedTracks>;
};

export type ParsedTrack = {
    'Album Artist'?: string;
    'Album Rating Computed'?: boolean;
    'Album Rating'?: number;
    Album?: string;
    Artist?: string;
    'Artwork Count'?: number;
    'Bit Rate'?: number;
    BPM?: number;
    Clean?: boolean;
    Comments?: string;
    Compilation?: boolean;
    Composer?: string;
    'Content Rating'?: string;
    'Date Added': Readonly<Date>;
    'Date Modified'?: Readonly<Date>;
    Disabled?: boolean;
    'Disc Count'?: number;
    'Disc Number'?: number;
    'Episode Order'?: number;
    Episode?: string;
    Equalizer?: string;
    Explicit?: boolean;
    'File Folder Count'?: number;
    'File Type'?: number;
    Genre?: string;
    Grouping?: string;
    'Has Video'?: boolean;
    Kind?: string;
    'Library Folder Count'?: number;
    Location?: string;
    Loved?: boolean;
    Movie?: boolean;
    'Music Video'?: boolean;
    Name: string;
    'Part Of Gapless Album'?: boolean;
    'Persistent ID': string;
    'Play Count'?: number;
    'Play Date UTC'?: Readonly<Date>;
    'Play Date'?: number;
    Podcast?: boolean;
    Protected?: boolean;
    Purchased?: boolean;
    'Rating Computed'?: boolean;
    Rating?: number;
    'Release Date'?: Readonly<Date>;
    'Sample Rate'?: number;
    Season?: number;
    Series?: string;
    Size?: number;
    'Skip Count'?: number;
    'Skip Date'?: Readonly<Date>;
    'Sort Album Artist'?: string;
    'Sort Album'?: string;
    'Sort Artist'?: string;
    'Sort Composer'?: string;
    'Sort Name'?: string;
    'Sort Series'?: string;
    'Start Time'?: number;
    'Stop Time'?: number;
    'Total Time'?: number;
    'Track Count'?: number;
    'Track ID': number;
    'Track Number'?: number;
    'Track Type': string;
    'TV Show'?: boolean;
    Unplayed?: boolean;
    'Volume Adjustment'?: number;
    Work?: string;
    Year?: number;
};

export type ParsedPlaylistItem = {
    'Track ID': number;
};

export type ParsedPlaylist = {
    'All Items': boolean;
    Audiobooks?: boolean;
    'Distinguished Kind'?: number;
    Folder?: boolean;
    Master?: boolean;
    Movies?: boolean;
    Music?: boolean;
    Name: string;
    'Parent Persistent ID'?: string;
    'Playlist ID': number;
    'Playlist Items'?: Readonly<Readonly<ParsedPlaylistItem>[]>;
    'Playlist Persistent ID': string;
    'Purchased Music'?: boolean;
    'Smart Criteria'?: Readonly<Buffer>;
    'Smart Info'?: Readonly<Buffer>;
    'TV Shows'?: boolean;
    Visible?: boolean;
};
