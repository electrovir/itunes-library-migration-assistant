import {LibraryNode} from './read-library';

// import {tNode} from 'txml';
// export type LibraryNodeIteratorValue = {node: LibraryNode; parent?: tNode; childIndex: number};

export function createNodeIterator(nodes: LibraryNode[]): Iterator<LibraryNode> {
    const depthTree: IterableIterator<LibraryNode>[] = [nodes[Symbol.iterator]()];
    const doneValue: IteratorResult<LibraryNode, undefined> = {value: undefined, done: true};

    function getTopValue(): IteratorResult<LibraryNode, undefined> {
        const currentIterator = depthTree[depthTree.length - 1];
        if (!currentIterator) {
            return doneValue;
        }

        const nextValue = currentIterator.next();

        if (nextValue.done) {
            depthTree.pop();
            return getTopValue();
        } else {
            if (typeof nextValue.value !== 'string' && nextValue.value.children.length) {
                depthTree.push(nextValue.value.children[Symbol.iterator]());
            }
            return nextValue;
        }
    }

    const iterator: Iterator<LibraryNode> = {
        next() {
            return getTopValue();
        },
    };

    return iterator;
}
