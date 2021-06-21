export class LibraryValidationError extends Error {
    public name = 'LibraryValidationError';

    constructor(message: string, nameTree: string[]) {
        super(message.concat(`\nParse tree: ${nameTree.join(' > ')}`));
    }
}
