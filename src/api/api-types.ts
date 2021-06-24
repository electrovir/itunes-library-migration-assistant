export type ReplacePath = {
    old: string;
    new: string;
};

export enum MigrationOutput {
    WriteToFile = 'write-to-file',
    JsonObject = 'json-object',
    PlistString = 'plist-string',
}

export type RunTimeOptions = {
    validationEnabled: boolean;
    loggingEnabled: boolean;
    checkReplacementPaths: boolean;
};

export const defaultOptions: RunTimeOptions = {
    validationEnabled: true,
    loggingEnabled: true,
    checkReplacementPaths: true,
} as const;

export type MigrationApiInput = {
    libraryFile: string;
    replacePaths: Readonly<Readonly<ReplacePath>[]>;
    outputType?: MigrationOutput;
    options?: Readonly<RunTimeOptions>;
};
