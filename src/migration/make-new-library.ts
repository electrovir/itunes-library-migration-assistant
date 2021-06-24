import {ReplacePath} from '../api/api-types';
import {LibraryMigrationError} from '../errors/library-migration-error';
import {LibraryParseError} from '../errors/library-parse-error';
import {ParsedLibrary, ParsedTracks} from './reading/parsed-types';

export function makeNewLibrary({
    oldLibrary,
    replacePaths,
    checkReplacementPaths = true,
    loggingEnabled = true,
}: Readonly<{
    oldLibrary: Readonly<ParsedLibrary>;
    replacePaths: Readonly<Readonly<ReplacePath>[]>;
    checkReplacementPaths?: boolean;
    loggingEnabled?: boolean;
}>): Readonly<ParsedLibrary> {
    const unreplacedPaths = new Set<string>();
    const replacePathUsage = replacePaths.map(() => 0);

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
            const newTrack = {
                ...oldTrack,
            };

            const oldLocation = newTrack.Location;

            if (oldLocation) {
                replacePaths.some((replacePath, replacePathIndex) => {
                    if (oldLocation.indexOf(replacePath.old)) {
                        newTrack.Location = oldLocation.replace(replacePath.old, replacePath.new);
                        ++replacePathUsage[replacePathIndex];
                        return true;
                    } else {
                        unreplacedPaths.add(oldLocation);
                        return false;
                    }
                });
            }

            newTracks[trackKey] = newTrack;

            return newTracks;
        }, {}),
    };
    loggingEnabled && console.info(`Replacing finished`);

    if (checkReplacementPaths) {
        const errors: string[] = [];

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

        if (errors.length) {
            throw new LibraryMigrationError(errors.join('\n'));
        }
    }

    return newLibrary;
}
