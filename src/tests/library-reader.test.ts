import {readFileSync} from 'fs';
import {testGroup} from 'test-vir';
import {parse, tNode} from 'txml';
import {getSampleFilePath} from '../file-paths';
import {LibraryNodeIteratorValue} from '../library-iterator';
import {LibraryNode, nodeToString, readLibrary, readLibraryTxmlOptions} from '../library-reader';

function assertCorrectedIteratedNodes(
    node: LibraryNode,
    expectedIndex: number,
    expectedParent: tNode | undefined,
    iteratedNodes: LibraryNodeIteratorValue[],
    includeWhitespace: boolean,
): void {
    if (!includeWhitespace && typeof node === 'string' && !node.trim()) {
        return;
    }

    const iteratedNode = iteratedNodes.find((iteratorValue) => {
        return (
            iteratorValue.node === node &&
            iteratorValue.childIndex === expectedIndex &&
            iteratorValue.parent?.node === expectedParent
        );
    });
    if (!iteratedNode) {
        throw new Error(
            `Could not find ${nodeToString(node)}, ${expectedIndex}, ${nodeToString(
                expectedParent,
            )}`,
        );
    }

    if (typeof node === 'string') {
        return;
    } else {
        node.children.forEach((childNode, index) =>
            assertCorrectedIteratedNodes(childNode, index, node, iteratedNodes, includeWhitespace),
        );
        return;
    }
}

testGroup((runTest) => {
    {
        const sampleLibraryFilePath = getSampleFilePath('library-example.xml');
        const sampleLibraryOutput = readLibrary(sampleLibraryFilePath);
        const iteratedSampleLibraryOutput = [...sampleLibraryOutput];
        const sampleLibraryNoIteratedWhitespaceOutput = readLibrary(sampleLibraryFilePath, true);
        const sampleLibraryNoIteratedWhitespaceIterated = [
            ...sampleLibraryNoIteratedWhitespaceOutput,
        ];

        runTest({
            description: 'readLibrary flattens txml output',
            expect: 560,
            test: () => {
                return iteratedSampleLibraryOutput.length;
            },
        });

        runTest({
            description: 'ignoring whitespace reduces the flattened size',
            expect: 357,
            test: () => {
                // console.log(
                //     JSON.stringify(
                //         sampleLibraryNoIteratedWhitespaceIterated.map((iterated) => {
                //             return {
                //                 node:
                //                     typeof iterated.node === 'string'
                //                         ? iterated.node
                //                         : iterated.node.tagName,
                //                 parent:
                //                     typeof iterated.parent?.node === 'string'
                //                         ? iterated.parent?.node
                //                         : iterated.parent?.node.tagName,
                //                 index: iterated.childIndex,
                //             };
                //         }),
                //         null,
                //         4,
                //     ),
                // );
                return sampleLibraryNoIteratedWhitespaceIterated.length;
            },
        });

        runTest({
            description: 'readLibrary for big file produces correct relationship mapping',
            test: () => {
                // console.log(JSON.stringify(sampleLibraryOutput.xml, null, 4));
                // console.log('==================================================================');
                // console.log('==================================================================');
                // console.log('==================================================================');
                // console.log('==================================================================');
                // console.log('==================================================================');
                // console.log('==================================================================');
                // console.log('==================================================================');
                // console.log('==================================================================');
                // console.log('==================================================================');
                // console.log(
                //     JSON.stringify(
                //         iteratedSampleLibraryOutput.map((iterated) => {
                //             return {
                //                 node:
                //                     typeof iterated.node === 'string'
                //                         ? iterated.node
                //                         : iterated.node.tagName,
                //                 parent:
                //                     typeof iterated.parent?.node === 'string'
                //                         ? iterated.parent?.node
                //                         : iterated.parent?.node.tagName,
                //                 index: iterated.childIndex,
                //             };
                //         }),
                //         null,
                //         4,
                //     ),
                // );
                sampleLibraryOutput.xml.forEach((topLevelNode, index) =>
                    assertCorrectedIteratedNodes(
                        topLevelNode,
                        index,
                        undefined,
                        iteratedSampleLibraryOutput,
                        true,
                    ),
                );
            },
        });

        runTest({
            description: 'txml produces non-flattened output',
            expect: 5,
            test: () => {
                const txmlOutput: (string | tNode)[] = parse(
                    readFileSync(sampleLibraryFilePath).toString(),
                    readLibraryTxmlOptions,
                );
                return txmlOutput.length;
            },
        });

        runTest({
            description: "ignoring white space in the iterated output shouldn't affect the results",
            test: () => {
                sampleLibraryNoIteratedWhitespaceOutput.xml.forEach((topLevelNode, index) =>
                    assertCorrectedIteratedNodes(
                        topLevelNode,
                        index,
                        undefined,
                        sampleLibraryNoIteratedWhitespaceIterated,
                        false,
                    ),
                );
            },
        });
    }

    {
        const simpleFilePath = getSampleFilePath('simple-example.xml');
        const simpleReaderOutput = readLibrary(simpleFilePath);
        const simpleIteratedOutput = [...simpleReaderOutput];

        runTest({
            description: 'readLibrary output nodes contain no children',
            expect: 16,
            test: () => simpleIteratedOutput.length,
        });

        runTest({
            description: "ignoring white space in the iterated output shouldn't affect the results",
            test: () => {
                const simpleNoIteratedWhitespace = readLibrary(simpleFilePath, true);
                simpleNoIteratedWhitespace.xml.forEach((topLevelNode, index) =>
                    assertCorrectedIteratedNodes(
                        topLevelNode,
                        index,
                        undefined,
                        [...simpleNoIteratedWhitespace],
                        false,
                    ),
                );
            },
        });

        runTest({
            description: 'readLibrary output contains all nodes',
            expect: ['?xml', 'message', 'to', 'from', 'heading', 'body'],
            test: () =>
                simpleIteratedOutput
                    .map((value) => value.node)
                    .filter((node): node is tNode => typeof node !== 'string')
                    .map((node) => node.tagName),
        });

        runTest({
            description: 'readLibrary output contains all whitespace and nodes',
            expect: [
                '?xml',
                '\n',
                'message',
                '\n    ',
                'to',
                'Alice',
                '\n    ',
                'from',
                'Bob',
                '\n    ',
                'heading',
                'Hello',
                '\n\n    ',
                'body',
                '\n        This is a demo!\n    ',
                '\n',
            ],
            test: () => simpleIteratedOutput.map((value) => nodeToString(value.node)),
        });

        runTest({
            description: 'readLibrary produces correct childIndex and parent properties',
            test: () => {
                simpleReaderOutput.xml.forEach((topLevelNode, index) =>
                    assertCorrectedIteratedNodes(
                        topLevelNode,
                        index,
                        undefined,
                        simpleIteratedOutput,
                        true,
                    ),
                );
            },
        });
    }
});
