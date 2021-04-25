import {LibraryNode} from './library-reader';

export type LibraryNodeIteratorValue = {
    node: LibraryNode;
    parent?: LibraryNodeIteratorValue;
    childIndex?: number;
};

export function createNodeIterator(
    nodes: LibraryNode[],
    ignoreWhiteSpace: boolean,
): Iterator<LibraryNodeIteratorValue> {
    const depthTree: IterableIterator<LibraryNode>[] = [nodes[Symbol.iterator]()];
    const indexTree: number[] = [-1];
    const parentTree: (LibraryNodeIteratorValue | undefined)[] = [undefined];

    function getTopValue(): IteratorResult<LibraryNodeIteratorValue, undefined> {
        const currentIndex = depthTree.length - 1;
        const currentIterator = depthTree[currentIndex];
        const currentChildIndex = indexTree[currentIndex]!;
        const currentParent = parentTree[currentIndex];

        if (!currentIterator) {
            return {value: undefined, done: true};
        }

        const nextValue = currentIterator.next();
        const nextChildIndex = currentChildIndex + 1;
        indexTree[currentIndex] = nextChildIndex;

        if (nextValue.done) {
            depthTree.pop();
            indexTree.pop();
            parentTree.pop();
            return getTopValue();
        } else {
            if (
                ignoreWhiteSpace &&
                typeof nextValue.value === 'string' &&
                !nextValue.value.trim()
            ) {
                return getTopValue();
            }

            const currentIteratorValue: LibraryNodeIteratorValue = {
                node: nextValue.value,
                parent: currentParent,
                childIndex: nextChildIndex,
            };
            if (typeof nextValue.value !== 'string' && nextValue.value.children.length) {
                depthTree.push(nextValue.value.children[Symbol.iterator]());
                indexTree.push(-1);
                parentTree.push(currentIteratorValue);
            }
            return {
                value: currentIteratorValue,
            };
        }
    }

    const iterator: Iterator<LibraryNodeIteratorValue> = {
        next() {
            return getTopValue();
        },
    };

    return iterator;
}
