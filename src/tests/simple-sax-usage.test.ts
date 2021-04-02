import {createReadStream} from 'fs';
import {createStream, QualifiedTag, Tag} from 'sax';
import {testGroup} from 'test-vir';
import {getSampleFilePath} from '../file-paths';

testGroup((runTest) => {
    runTest({
        description: 'all opening tags should get counted',
        expect: 5,
        test: async () => {
            return new Promise<number>((resolve, reject) => {
                const saxStream = createStream(true);
                const nodes: (Tag | QualifiedTag)[] = [];
                saxStream.on('opentag', (node) => {
                    nodes.push(node);
                });
                saxStream.on('end', () => {
                    resolve(nodes.length);
                });
                saxStream.on('error', (error) => {
                    reject(error);
                });
                const stream = createReadStream(getSampleFilePath('simple-example.xml'));
                // catch file not found errors
                stream.on('error', (error) => {
                    reject(error);
                });

                stream.pipe(saxStream);
            });
        },
    });

    runTest({
        description: 'all closing tags should get counted',
        expect: 5,
        test: async () => {
            return new Promise<number>((resolve, reject) => {
                const saxStream = createStream(true);
                const nodes: string[] = [];
                saxStream.on('closetag', (node) => {
                    nodes.push(node);
                });
                saxStream.on('end', () => {
                    resolve(nodes.length);
                });
                saxStream.on('error', (error) => {
                    reject(error);
                });
                const stream = createReadStream(getSampleFilePath('simple-example.xml'));
                // catch file not found errors
                stream.on('error', (error) => {
                    reject(error);
                });

                stream.pipe(saxStream);
            });
        },
    });

    runTest({
        description: 'invalid file paths should cause error',
        expectError: {
            errorMessage: /ENOENT.*/,
        },
        test: async () => {
            return new Promise<number>((_, reject) => {
                const stream = createReadStream('');
                // catch file not found errors
                stream.on('error', (error) => {
                    reject(error);
                });
            });
        },
    });
});
