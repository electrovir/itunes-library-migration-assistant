import {createReadStream} from 'fs';
import {createStream, QualifiedTag, Tag} from 'sax';
import {testGroup} from 'test-vir';
import {getSampleFilePath} from '../../file-paths';

testGroup({
    description: 'simple sax usage',
    tests: (runTest) => {
        const simpleExampleFilePath = getSampleFilePath('simple-example.xml');
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
                    const stream = createReadStream(simpleExampleFilePath);
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
                    const stream = createReadStream(simpleExampleFilePath);
                    // catch file not found errors
                    stream.on('error', (error) => {
                        reject(error);
                    });

                    stream.pipe(saxStream);
                });
            },
        });

        runTest({
            description: 'read tag content',
            expect: 'Alice',
            test: async () => {
                return new Promise<string>((resolve, reject) => {
                    const saxStream = createStream(true);
                    let getNextText = false;
                    let toField = '';
                    saxStream.on('opentag', (node) => {
                        if (node.name === 'to') {
                            getNextText = true;
                        }
                    });
                    saxStream.on('text', (text) => {
                        if (getNextText) {
                            toField = text;
                            getNextText = false;
                        }
                    });
                    saxStream.on('end', () => {
                        resolve(toField);
                    });
                    saxStream.on('error', (error) => {
                        reject(error);
                    });
                    const stream = createReadStream(simpleExampleFilePath);
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
    },
});

testGroup({
    description: 'sax usage with more tags',
    tests: (runTest) => {
        const multiSimpleExampleFilePath = getSampleFilePath('multi-simple-example.xml');
        const expectedProperties = ['to', 'from', 'heading', 'body'];

        runTest({
            description: 'all data should be read',
            expect: 4,
            test: async () => {
                return new Promise<number>((resolve, reject) => {
                    const saxStream = createStream(true);
                    let currentMessageNode: Tag | QualifiedTag | undefined;

                    let messageData: Record<string, string> | undefined;
                    const allMessages: Record<string, string>[] = [];
                    let lastProperty: string | undefined;

                    saxStream.on('opentag', (node) => {
                        if (node.name === 'message') {
                            currentMessageNode = node;
                            messageData = {};
                        } else if (currentMessageNode) {
                            if (lastProperty) {
                                return reject(
                                    new Error(
                                        `Already waiting on a new property value: ${lastProperty}`,
                                    ),
                                );
                            }
                            lastProperty = node.name;
                        }
                    });
                    saxStream.on('closetag', (nodeName) => {
                        if (nodeName === 'message' && messageData) {
                            allMessages.push(messageData);
                            messageData = undefined;
                        }
                    });
                    saxStream.on('text', (textNode) => {
                        const text = textNode.trim();

                        if (!text) {
                            return;
                        }

                        if (!lastProperty) {
                            return reject(
                                new Error(
                                    `Got a text node but no property name was ready: ${text}`,
                                ),
                            );
                        }
                        if (!messageData) {
                            return reject(
                                new Error(
                                    `Got a text node but no message data object was ready: ${text}`,
                                ),
                            );
                        }
                        messageData[lastProperty] = text;
                        lastProperty = undefined;
                    });
                    saxStream.on('end', () => {
                        if (
                            !allMessages.every((message) =>
                                expectedProperties.every((property) =>
                                    message.hasOwnProperty(property),
                                ),
                            )
                        ) {
                            console.error(allMessages);
                            return reject(
                                new Error(
                                    `Not all objects contained the properties: ${expectedProperties}`,
                                ),
                            );
                        }

                        resolve(allMessages.length);
                    });
                    saxStream.on('error', (error) => {
                        reject(error);
                    });

                    const stream = createReadStream(multiSimpleExampleFilePath);
                    // catch file not found errors
                    stream.on('error', (error) => {
                        reject(error);
                    });

                    stream.pipe(saxStream);
                });
            },
        });
        /** This test is flaky. The issue is the streaming, see comment below about it not being safe. */
        // runTest({
        //     description: 'should be able to stream to a file',
        //     expect: readFileSync(getSampleFilePath('test-stream-to-file.comparison.txt'))
        //         .toString()
        //         .trim(),
        //     test: async () => {
        //         /**
        //          * I'm pretty sure this is NOT SAFE to use for large files. It does not handle back
        //          * pressure or forward pressure. It is merely a simple example.
        //          */
        //         return new Promise<string>((resolve, reject) => {
        //             const outputPath = getOutputFilePath('test-stream-to-file.txt');
        //             const outputStream = createWriteStream(outputPath, {flags: 'w'});

        //             const saxStream = createStream(true);

        //             saxStream.on('opentag', (node) => {
        //                 outputStream.write(node.name + '\n');
        //             });

        //             saxStream.on('end', () => {
        //                 outputStream.close();
        //                 const fileContents = readFileSync(outputPath).toString();
        //                 unlinkSync(outputPath);
        //                 resolve(fileContents.trim());
        //             });

        //             saxStream.on('error', (error) => {
        //                 reject(error);
        //             });
        //             const stream = createReadStream(multiSimpleExampleFilePath);
        //             // catch file not found errors
        //             stream.on('error', (error) => {
        //                 reject(error);
        //             });

        //             stream.pipe(saxStream);
        //         });
        //     },
        // });
    },
});
