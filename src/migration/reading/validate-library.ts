import {LibraryValidationError} from '../../errors/library-validation-error';
import {ParsedLibrary} from './parsed-types';
import {
    parsedLibraryTypes,
    parsedPlaylistItemTypes,
    parsedPlaylistTypes,
    parsedTrackTypes,
    ValidationTypes,
} from './validation-types';

type ValidationBasis = {
    types: ValidationTypes<
        // this type has no idea what the keys are, they're just arbitrary strings
        Record<string, string>
    >;
    subTypes?: Record<string, ValidationBasis>;
};

function validateObject(
    name: string,
    input: unknown,
    validationBasis: ValidationBasis,
    nameTree: string[],
): LibraryValidationError[] {
    const errors: LibraryValidationError[] = [];

    if (input === undefined) {
        errors.push(new LibraryValidationError(`${name} does not exist.`, nameTree.concat(name)));
    } else if (typeof input !== 'object' || !input) {
        errors.push(
            new LibraryValidationError(`${name} is not an object: ${input}`, nameTree.concat(name)),
        );
    } else {
        const invalidKeys = Object.keys(input).filter((libraryKey) => {
            const validationComparison = validationBasis.types[libraryKey];
            if (!validationComparison) {
                // if we don't have the key in validation checks, that will be caught later
                return false;
            }

            const value: any = (input as any)[libraryKey];
            if (validationComparison.type === 'Date') {
                if (!(value instanceof Date)) {
                    return true;
                }
            } else if (validationComparison.type === 'Buffer') {
                if (!(value instanceof Buffer)) {
                    return true;
                }
            } else if (typeof value !== validationComparison.type) {
                return true;
            }

            if (validationComparison.type === 'object') {
                const subValidation = validationBasis.subTypes?.[libraryKey];
                if (subValidation) {
                    Object.keys(value).forEach((subKey) => {
                        const subValue = value[subKey];
                        errors.push(
                            ...validateObject(
                                libraryKey,
                                subValue,
                                subValidation,
                                nameTree.concat(name),
                            ),
                        );
                    });
                } else {
                    errors.push(
                        new LibraryValidationError(
                            `Missing validation basis for ${libraryKey} key in ${name}`,
                            nameTree.concat(name),
                        ),
                    );
                }
            }

            return false;
        });

        const missingValidationKeys = Object.keys(input).filter((libraryKey) => {
            return !(libraryKey in validationBasis.types);
        });

        const missingKeys = Object.keys(validationBasis.types).filter((validationKey) => {
            return !(validationKey in input) && validationBasis.types[validationKey]!.required;
        });

        const invalidValues = invalidKeys.reduce(
            (accum: Record<string, {expected: string | undefined; got: unknown}>, key) => {
                accum[key] = {
                    expected: validationBasis.types[key]?.type || 'undefined',
                    got: typeof (input as any)[key],
                };
                return accum;
            },
            {},
        );
        const invalidKeysMessage = invalidKeys.length
            ? `Invalid ${name} keys:\n\t\t${JSON.stringify(invalidValues, null, 4)
                  .split('\n')
                  .join('\n\t\t')}`
            : '';
        const missingKeysMessage = missingKeys.length
            ? `Missing ${name} keys:\n\t\t${missingKeys.join(', ')}`
            : '';
        const missingValidationKeysMessage = missingValidationKeys.length
            ? `Missing ${name} validation for keys:\n\t\t${missingValidationKeys.join(', ')}`
            : '';
        const errorMessages = [
            invalidKeysMessage,
            missingKeysMessage,
            missingValidationKeysMessage,
        ].filter((message) => !!message);

        if (errorMessages.length) {
            errors.push(
                new LibraryValidationError(
                    `${(input as {Name?: string}).Name} errors:\n\t${errorMessages.join('\n\t')}`,
                    nameTree.concat(name),
                ),
            );
        }
    }

    return errors;
}

export function assertValidLibrary(parsedLibrary: any): asserts parsedLibrary is ParsedLibrary {
    const validationErrors = validateObject(
        'whole library',
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

    if (validationErrors.length) {
        throw new LibraryValidationError(
            '\n' + validationErrors.map((validationError) => validationError.message).join('\n'),
        );
    }
}
