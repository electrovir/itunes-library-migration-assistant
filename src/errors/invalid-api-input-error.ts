import {MigrationApiInput} from '../api/api-types';

export class InvalidApiInputError extends Error {
    public name = 'InvalidApiInputError';
    constructor(invalidProperty: keyof MigrationApiInput, reason: string) {
        super(
            `Error in "${invalidProperty}" input property. ${reason} See \`MigrationApiInput\` type for complete input format.`,
        );
    }
}
