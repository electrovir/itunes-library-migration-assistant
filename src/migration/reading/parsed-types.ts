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
    'Artwork Count'?: number;
    'Bit Rate': number;
    'Date Added': string;
    'Date Modified': string;
    'Disc Count'?: number;
    'Disc Number'?: number;
    'File Folder Count': number;
    'File Type': number;
    'Library Folder Count': number;
    'Persistent ID': string;
    'Play Count': number;
    'Play Date UTC': string;
    'Play Date': number;
    'Rating Computed'?: boolean;
    'Release Date'?: Date;
    'Sample Rate': number;
    'Skip Count': number;
    'Skip Date': string;
    'Total Time': number;
    'Track Count'?: number;
    'Track ID': number;
    'Track Number'?: number;
    'Track Type': string;
    Album: string;
    Artist: string;
    BPM: number;
    Comments?: string;
    Composer: string;
    Genre: string;
    Kind: string;
    Location: string;
    Name: string;
    Protected?: boolean;
    Purchased?: boolean;
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
