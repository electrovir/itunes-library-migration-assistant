import {existsSync} from 'fs';
import {InputPath, ReplacePath} from '../api/api-types';
import {decodeLocation, encodeLocation} from '../augments/string';
import {RequiredBy} from '../augments/type';
import {LibraryMigrationError} from '../errors/library-migration-error';
import {LibraryParseError} from '../errors/library-parse-error';
import {ParsedLibrary, ParsedTrack, ParsedTracks} from './reading/parsed-types';

export function makeNewLibrary({
    oldLibrary,
    replacePaths,
    checkReplacementPaths = true,
    loggingEnabled = true,
    checkFiles = false,
    setRatingCalculated = false,
}: Readonly<{
    oldLibrary: Readonly<ParsedLibrary>;
    replacePaths: Readonly<Readonly<InputPath>[]>;
    checkReplacementPaths?: boolean;
    loggingEnabled?: boolean;
    checkFiles?: boolean;
    setRatingCalculated?: boolean;
}>): Readonly<ParsedLibrary> {
    const unreplacedPaths = new Set<string>();
    const replacePathUsage = replacePaths.map(() => 0);
    const missingFiles: ReplacePath[] = [];

    loggingEnabled && console.info(`Replacing locations...`);
    const newLibrary: Readonly<ParsedLibrary> = {
        ...oldLibrary,
        Tracks: Object.keys(oldLibrary.Tracks).reduce((newTracks: ParsedTracks, trackKey) => {
            const oldTrack = oldLibrary.Tracks[trackKey];
            if (!oldTrack) {
                throw new LibraryParseError(
                    `Track key "${trackKey}" didn't actually exist in the library`,
                );
            }

            let rawNewTrack: ParsedTrack = {
                ...oldTrack,
                ...(setRatingCalculated
                    ? {
                          ...(oldTrack.hasOwnProperty('Rating') ? {'Rating Computed': true} : {}),
                          ...(oldTrack.hasOwnProperty('Album Rating')
                              ? {'Rating Computed': true}
                              : {}),
                      }
                    : {}),
            };

            const originalLocation = rawNewTrack.Location;
            let markedForDeletion = false;

            if (originalLocation) {
                const updatingTrack: RequiredBy<ParsedTrack, 'Location'> = {
                    ...rawNewTrack,
                } as RequiredBy<ParsedTrack, 'Location'>;

                const replaced = replacePaths.reduce((replaced, replacePath, replacePathIndex) => {
                    let used = false;

                    if (
                        updatingTrack.Location.includes(replacePath.old) ||
                        decodeLocation(updatingTrack.Location).includes(replacePath.old)
                    ) {
                        if ('delete' in replacePath && replacePath.delete) {
                            markedForDeletion = true;
                            used = true;
                        } else if ('new' in replacePath && replacePath.new) {
                            updatingTrack.Location = updatingTrack.Location.replace(
                                replacePath.old,
                                replacePath.new,
                            );
                            if (
                                updatingTrack.Location === updatingTrack.Location &&
                                !updatingTrack.Location.startsWith('http')
                            ) {
                                // try with sanitization
                                updatingTrack.Location = encodeLocation(
                                    decodeLocation(updatingTrack.Location).replace(
                                        replacePath.old,
                                        replacePath.new,
                                    ),
                                );
                            }
                            used = true;
                        } else {
                            throw new LibraryMigrationError(
                                `Replace path contained neither valid .new or valid .delete: ${JSON.stringify(
                                    replacePath,
                                )}`,
                            );
                        }
                    }

                    if (used) {
                        ++replacePathUsage[replacePathIndex];
                    }

                    return replaced || used;
                }, false);

                if (replaced) {
                    if (
                        !markedForDeletion &&
                        checkFiles &&
                        !updatingTrack.Location.startsWith('http') &&
                        !existsSync(decodeLocation(updatingTrack.Location))
                    ) {
                        missingFiles.push({
                            old: decodeLocation(originalLocation),
                            new: decodeLocation(updatingTrack.Location),
                        });
                    }
                } else {
                    unreplacedPaths.add(originalLocation);
                }

                rawNewTrack = updatingTrack;
            }

            if (!markedForDeletion) {
                newTracks[trackKey] = rawNewTrack;
            }

            return newTracks;
        }, {}),
    };
    loggingEnabled && console.info(`Replacing finished`);

    const errors: string[] = [];

    if (checkReplacementPaths) {
        unreplacedPaths.forEach((path) => {
            errors.push(`This track location was not replaced:\n\t\t\t${path}`);
        });

        replacePathUsage.forEach((usage, index) => {
            if (!usage) {
                errors.push(
                    `The following replacement was never used:\n\t\t\t${JSON.stringify(
                        replacePaths[index],
                        null,
                        4,
                    )}`,
                );
            }
        });
    }

    if (missingFiles.length) {
        missingFiles.forEach((missingFile) => {
            errors.push(
                `\tMissing file:\n\t\t${JSON.stringify(missingFile, null, '\t\t\t').replace(
                    /}$/,
                    '\t\t}',
                )}`,
            );
        });
    }

    if (errors.length) {
        throw new LibraryMigrationError('\n' + errors.join('\n'));
    }
    return newLibrary;
}
