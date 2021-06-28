export type ReplacePath = {
    old: string;
    new: string;
};

export type DeletePath = {
    old: string;
    delete: true;
};

export type InputPath = DeletePath | ReplacePath;

export enum MigrationOutput {
    WriteToFile = 'write-to-file',
    JsonObject = 'json-object',
    PlistString = 'plist-string',
}

export type RunTimeOptions = {
    validationEnabled: boolean;
    loggingEnabled: boolean;
    checkReplacementPaths: boolean;
    checkFiles: boolean;
};

export const defaultOptions: RunTimeOptions = {
    validationEnabled: true,
    loggingEnabled: true,
    checkReplacementPaths: true,
    checkFiles: false,
} as const;

export type MigrationApiInput<OutputType extends MigrationOutput = MigrationOutput> = {
    libraryFilePath: string;
    replacePaths: Readonly<Readonly<InputPath>[]>;
    outputType?: OutputType;
    options?: Readonly<Partial<RunTimeOptions>>;
};
