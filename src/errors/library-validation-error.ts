export class LibraryValidationError extends Error {
    public name = 'LibraryValidationError';

    constructor(message: string, nameTree?: string[]) {
        super(message.concat(nameTree ? `\n\tParse tree: ${nameTree.join(' > ')}` : ''));
    }
}
