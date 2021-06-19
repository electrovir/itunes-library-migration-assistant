export type ReplacePath = {
    old: string;
    new: string;
};

export enum MigrationOutput {
    WriteToFile = 'write-to-file',
    JsonObject = 'json-object',
    PlistString = 'plist-string',
}

export type MigrationApiInput = {
    libraryFile: string;
    replacePaths: Readonly<Readonly<ReplacePath>[]>;
    outputType?: MigrationOutput;
};
