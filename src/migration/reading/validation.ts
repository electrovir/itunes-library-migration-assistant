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
            const validationValue = validationBasis.types[libraryKey];
            if (!validationValue) {
                // if the key is missing and required, it will be caught later
                return false;
            }

            const value: any = (input as any)[libraryKey];
            if (validationValue.type === 'Date') {
                if (!(value instanceof Date)) {
                    return true;
                }
            } else if (validationValue.type === 'Buffer') {
                if (!(value instanceof Buffer)) {
                    return true;
                }
            } else if (typeof value !== validationValue.type) {
                return true;
            }

            if (validationValue.type === 'object') {
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
            ? `Invalid ${name} keys:\n${JSON.stringify(invalidValues, null, 4)}`
            : '';
        const missingKeysMessage = missingKeys.length
            ? `Missing keys: ${missingKeys.join(', ')}`
            : '';

        if (invalidKeys.length || missingKeys.length) {
            const separator = invalidKeys.length && missingKeys.length ? '\n' : '';
            errors.push(
                new LibraryValidationError(
                    `${invalidKeysMessage}${separator}${missingKeysMessage}`,
                    nameTree.concat(name),
                ),
            );
        }
    }

    return errors;
}

export function assertValidLibrary(
    parsedLibrary: any,
    fileName: string,
): asserts parsedLibrary is ParsedLibrary {
    const validationErrors = validateObject(
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

    if (validationErrors.length) {
        throw new Error(
            validationErrors.map((validationError) => String(validationError)).join('\n'),
        );
    }
}
