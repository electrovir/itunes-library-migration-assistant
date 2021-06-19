import {existsSync} from 'fs';
import {getEnumTypedValues} from '../augments/object';
import {InvalidApiInputError} from '../errors/invalid-api-input-error';
import {MigrationApiInput, MigrationOutput} from './api-types';

export function assertValidApiInput(
    input: Readonly<MigrationApiInput>,
): asserts input is MigrationApiInput {
    if (!input.libraryFile) {
        throw new InvalidApiInputError('libraryFile', 'Missing path.');
    }

    if (!existsSync(input.libraryFile)) {
        throw new InvalidApiInputError(
            'libraryFile',
            'File does not exist: "${input.libraryFile}".',
        );
    }

    if (!input.replacePaths || !input.replacePaths.length) {
        throw new InvalidApiInputError('replacePaths', 'No paths given.');
    }

    const invalidPaths = input.replacePaths.filter((replacePath) => {
        return replacePath.new && replacePath.old;
    });

    if (invalidPaths.length) {
        throw new InvalidApiInputError(
            'replacePaths',
            `Invalid paths encountered:\n${JSON.stringify(invalidPaths, null, 4)}`,
        );
    }

    if (input.outputType && !getEnumTypedValues(MigrationOutput).includes(input.outputType)) {
        throw new InvalidApiInputError('outputType', `Unrecognized value: ${input.outputType}`);
    }
}

export function api(input: Readonly<MigrationApiInput>) {
    assertValidApiInput(input);

    const {libraryFile, replacePaths} = input;

    // migrateLibrary();
}
