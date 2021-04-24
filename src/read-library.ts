import {readFileSync} from 'fs';
import {parse, tNode, TParseOptions} from 'txml';
import {createNodeIterator} from './node-iterator';

export const readLibraryTxmlOptions: Readonly<TParseOptions> = {
    keepWhitespace: true,
    keepComments: true,
} as const;

export type LibraryNode = string | Readonly<tNode>;

export function readLibrary(
    libraryFilePath: string,
): Readonly<{xml: LibraryNode[]}> & Iterable<LibraryNode> {
    const fileContents = readFileSync(libraryFilePath).toString();
    const txmlOutput: LibraryNode[] = parse(fileContents, readLibraryTxmlOptions);

    return {
        xml: txmlOutput,
        [Symbol.iterator]: () => createNodeIterator(txmlOutput),
    };
}
