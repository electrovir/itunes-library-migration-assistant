import {ActionOrder, createStateMachine} from 'fsm-vir';
import {tNode} from 'txml';
import {LibraryNode} from './read-library';

export type LibraryParserOptions = {
    stream: boolean;
};

export enum LibraryState {
    Start = 'Start',
    End = 'End',
}

type ParsedTrack = {};

type ParsedLibrary = {
    /**
     * The encoding read from the library file's ?xml tag. I'm not certain if BufferEncoding is an
     * exhaustive list of options for this.
     */
    encoding: BufferEncoding;
    /**
     * All nodes before the plist (which we don't really care about) stored here so we can just
     * directly spit it back out when reforming the library xml file.
     */
    prePlistNodes: LibraryNode[];
    plistNode: tNode;
    tracks: ParsedTrack[];
};

export const libraryStateMachine = createStateMachine({
    calculateNextState: (state, input: string) => {
        return LibraryState.End;
    },
    performStateAction: (state, input: string, lastOutput) => {
        return lastOutput;
    },
    actionStateOrder: ActionOrder.After,
    enableLogging: true,
    initialOutput: {},
    initialState: LibraryState.Start,
    endState: LibraryState.End,
});

const defaultParserOptions: LibraryParserOptions = {
    stream: false,
} as const;

export function parseLibrary(
    filePath: string,
    options: Partial<LibraryParserOptions> = defaultParserOptions,
) {
    if (options.stream) {
        throw new Error('Streaming library parsing is not implemented yet.');
    } else {
        const buildingLibrary: Partial<ParsedLibrary> = {};

        // txmlOutput.forEach();
    }
}
