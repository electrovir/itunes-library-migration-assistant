import {readFileSync} from 'fs';
import {testGroup} from 'test-vir';
import {parse, tNode} from 'txml';
import {getSampleFilePath} from './file-paths';
import {readLibrary, readLibraryTxmlOptions} from './read-library';

testGroup((runTest) => {
    const sampleLibraryFilePath = getSampleFilePath('library-example.xml');

    runTest({
        description: 'readLibrary flattens txml output',
        expect: 560,
        test: () => {
            const sampleLibraryOutput = [...readLibrary(sampleLibraryFilePath)];
            return sampleLibraryOutput.length;
        },
    });

    {
        const simpleOutput = [...readLibrary(getSampleFilePath('simple-example.xml'))];

        runTest({
            description: 'readLibrary output nodes contain no children',
            expect: 16,
            test: () => simpleOutput.length,
        });

        runTest({
            description: 'readLibrary output contains all nodes',
            expect: ['?xml', 'message', 'to', 'from', 'heading', 'body'],
            test: () =>
                simpleOutput
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
            test: () =>
                simpleOutput.map((node) => (typeof node === 'string' ? node : node.tagName)),
        });
    }

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
});
