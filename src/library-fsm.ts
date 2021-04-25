import {ActionOrder, createStateMachine} from 'fsm-vir';
import {tNode} from 'txml';
import {LibraryNodeIteratorValue} from './library-iterator';
import {LibraryNode, nodeToString} from './library-reader';

export type LibraryParserOptions = {
    stream: boolean;
};

export enum LibraryState {
    WaitingForAList = 'WaitingForAList',
    WaitingForTracksDict = 'WaitingForTracksDict',
    WaitingForNextTrack = 'WaitingForNextTrack',
    ParsingTrack = 'ParsingTrack',
    WaitingForPlaylistArray = 'WaitingForPlaylistArray',
    WaitingForNextPlaylist = 'WaitingForNextPlaylist',
    ParsingPlaylist = 'ParsingPlaylist',
    WaitingForPlaylistItemsArray = 'WaitingForPlaylistItemsArray',
    ParsingPlaylistTracks = 'ParsingPlaylistTracks',
    End = 'End',
}

export type ParsedValue<T> = Omit<ParsedNode, 'otherProperties'> & {value: T};

export type ParsedNode = {
    originalIteratedNode: LibraryNodeIteratorValue;
    otherProperties: Record<string, ParsedValue<unknown>>;
};

export type ParsedTrack = ParsedNode & {};

export type ParsedPlaylist = ParsedNode & {playlistItems: ParsedValue<number>[]};

export type ParsedLibrary = {
    originalXml: LibraryNode[];
    tracks: ParsedTrack[];
    playlists: ParsedPlaylist[];
};

export const libraryStateMachine = createStateMachine<
    LibraryState,
    LibraryNodeIteratorValue,
    Partial<ParsedLibrary>
>({
    calculateNextState: nextState,
    performStateAction: stateAction,
    actionStateOrder: ActionOrder.Before,
    enableLogging: true,
    initialOutput: {},
    initialState: LibraryState.WaitingForAList,
    endState: LibraryState.End,
    ignoreEndOfInput: true,
    customLogger: (state, input, index, output): string => {
        return `currentState: ${state} input: ${JSON.stringify(nodeToString(input.node))}`;
    },
});

function findInAncestors(
    lookingFor: tNode | undefined,
    searchIn: LibraryNodeIteratorValue | undefined,
): boolean {
    if (!searchIn || !lookingFor) {
        return false;
    } else if (searchIn.node === lookingFor) {
        return true;
    }

    return findInAncestors(lookingFor, searchIn.parent);
}

function nodeTagEquals(node: LibraryNode, tag: string): node is tNode {
    return (
        typeof node !== 'string' && node.tagName.trim().toUpperCase() === tag.trim().toUpperCase()
    );
}

function nodeStringEquals(node: LibraryNode, input: string): node is string {
    return typeof node === 'string' && node.trim().toUpperCase() === input.trim().toUpperCase();
}

let currentParsing: tNode | undefined;
let currentParsingGroup: tNode | undefined;

function nextState(state: LibraryState, input: LibraryNodeIteratorValue): LibraryState {
    let nextState = state;
    if (state === LibraryState.WaitingForTracksDict) {
        if (nodeTagEquals(input.node, 'dict')) {
            currentParsingGroup = input.node;
            nextState = LibraryState.WaitingForNextTrack;
        }
    } else if (state === LibraryState.WaitingForNextTrack) {
        if (!findInAncestors(currentParsingGroup, input)) {
            // switch to looking for playlists
            nextState = LibraryState.WaitingForAList;
        }
        if (nodeTagEquals(input.node, 'dict')) {
            currentParsing = input.node;
            nextState = LibraryState.ParsingTrack;
        }
    } else if (state === LibraryState.ParsingTrack) {
        if (!findInAncestors(currentParsing, input)) {
            nextState = LibraryState.WaitingForNextTrack;
        }
    } else if (state === LibraryState.WaitingForPlaylistArray) {
        if (nodeTagEquals(input.node, 'array')) {
            currentParsingGroup = input.node;
            nextState = LibraryState.WaitingForNextPlaylist;
        }
    } else if (state === LibraryState.ParsingPlaylistTracks) {
        if (!findInAncestors(currentParsing, input)) {
            nextState = LibraryState.WaitingForNextPlaylist;
        }
    } else if (state === LibraryState.ParsingPlaylist) {
        if (nodeStringEquals(input.node, 'playlist items')) {
            nextState = LibraryState.WaitingForPlaylistItemsArray;
        }
    } else if (state === LibraryState.WaitingForPlaylistItemsArray) {
        if (nodeTagEquals(input.node, 'array')) {
            nextState = LibraryState.ParsingPlaylistTracks;
        }
    }

    if (state === LibraryState.WaitingForAList || nextState === LibraryState.WaitingForAList) {
        if (
            typeof input.node === 'string' &&
            input.parent &&
            nodeTagEquals(input.parent.node, 'key')
        ) {
            if (nodeStringEquals(input.node, 'TRACKS')) {
                nextState = LibraryState.WaitingForTracksDict;
            } else if (nodeStringEquals(input.node, 'PLAYLISTS')) {
                nextState = LibraryState.WaitingForPlaylistArray;
            }
        }
    }

    if (
        state === LibraryState.WaitingForNextPlaylist ||
        nextState === LibraryState.WaitingForNextPlaylist
    ) {
        if (!findInAncestors(currentParsingGroup, input)) {
            // switch to looking for playlists
            nextState = LibraryState.WaitingForAList;
        }
        if (nodeTagEquals(input.node, 'dict')) {
            currentParsing = input.node;
            nextState = LibraryState.ParsingPlaylist;
        }
    }

    return nextState;
}

function stateAction(
    state: LibraryState,
    input: LibraryNodeIteratorValue,
    lastOutput: Partial<ParsedLibrary>,
): Partial<ParsedLibrary> {
    return lastOutput;
}
