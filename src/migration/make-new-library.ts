import {existsSync} from 'fs';
import {InputPath, ReplacePath} from '../api/api-types';
import {decodeLocation, encodeLocation} from '../augments/string';
import {LibraryMigrationError} from '../errors/library-migration-error';
import {LibraryParseError} from '../errors/library-parse-error';
import {ParsedLibrary, ParsedTrack, ParsedTracks} from './reading/parsed-types';

export function makeNewLibrary({
    oldLibrary,
    replacePaths,
    checkReplacementPaths = true,
    loggingEnabled = true,
    checkFiles = false,
}: Readonly<{
    oldLibrary: Readonly<ParsedLibrary>;
    replacePaths: Readonly<Readonly<InputPath>[]>;
    checkReplacementPaths?: boolean;
    loggingEnabled?: boolean;
    checkFiles?: boolean;
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
            const newTrack: ParsedTrack = {
                ...oldTrack,
            };

            const oldLocation = newTrack.Location;
            let markedForDeletion = false;

            if (oldLocation) {
                const replaced = replacePaths.some((replacePath, replacePathIndex) => {
                    let used = false;

                    if (oldLocation.includes(replacePath.old)) {
                        if ('delete' in replacePath && replacePath.delete) {
                            markedForDeletion = true;
                            used = true;
                        } else if ('new' in replacePath && replacePath.new) {
                            newTrack.Location = oldLocation.replace(
                                replacePath.old,
                                replacePath.new,
                            );
                            if (
                                newTrack.Location === oldLocation &&
                                !oldLocation.startsWith('http')
                            ) {
                                // try with sanitization
                                newTrack.Location = encodeLocation(
                                    decodeLocation(oldLocation).replace(
                                        replacePath.old,
                                        replacePath.new,
                                    ),
                                );
                            }

                            if (
                                checkFiles &&
                                !newTrack.Location.startsWith('http') &&
                                !existsSync(decodeLocation(newTrack.Location))
                            ) {
                                missingFiles.push({
                                    old: decodeLocation(oldLocation),
                                    new: decodeLocation(newTrack.Location),
                                });
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

                    return used;
                });

                if (!replaced) {
                    unreplacedPaths.add(oldLocation);
                }
            }

            if (!markedForDeletion) {
                newTracks[trackKey] = newTrack;
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
