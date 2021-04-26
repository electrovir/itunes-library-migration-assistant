import {readFileSync} from 'fs';
import {parse, tNode, TParseOptions} from 'txml';
import {createNodeIterator, LibraryNodeIteratorValue} from './library-iterator';

export const readLibraryTxmlOptions: Readonly<TParseOptions> = {
    keepWhitespace: true,
    keepComments: true,
} as const;

export type LibraryNode = string | Readonly<tNode>;

export function readLibrary(
    libraryFilePath: string,
    omitIteratedWhiteSpace = false,
): Readonly<{xml: LibraryNode[]}> & Iterable<LibraryNodeIteratorValue> {
    const fileContents = readFileSync(libraryFilePath).toString();
    const txmlOutput: LibraryNode[] = parse(fileContents, readLibraryTxmlOptions);

    return {
        xml: txmlOutput,
        [Symbol.iterator]: () => createNodeIterator(txmlOutput, omitIteratedWhiteSpace),
    };
}

export function nodeToString(input: LibraryNode | undefined): string {
    if (typeof input === 'string') {
        return input;
    } else if (input == undefined) {
        return 'undefined';
    } else {
        return input.tagName;
    }
}
