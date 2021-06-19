import * as byline from 'byline';
import {createReadStream} from 'fs';
import * as sax from 'sax';
import {testGroup} from 'test-vir';
import {getSampleFilePath} from '../file-paths';

testGroup({
    description: 'simple byline streaming usage',
    tests: (runTest) => {
        runTest({
            description: 'sax stream should only get output when we explicitly read it',
            expect: 8,
            test: async () => {
                return new Promise<number>((resolve, reject) => {
                    const readStream = createReadStream(getSampleFilePath('simple-example.xml'));
                    const bylineStream = byline.createStream(readStream);
                    const saxStream = sax.createStream(true);
                    const output: string[] = [];
                    let readCallIndex = 0;
                    const timeout = 0;

                    function triggerRead() {
                        ++readCallIndex;
                        if (readCallIndex > 4) {
                            const line = bylineStream.read();
                            readCallIndex = 0;

                            if (line !== null) {
                                setTimeout(() => {
                                    triggerRead();
                                }, timeout);
                            }
                        } else {
                            output.push(String(readCallIndex));
                            setTimeout(() => {
                                triggerRead();
                            }, timeout);
                        }
                    }

                    let alreadyReading = false;

                    bylineStream.on('readable', () => {
                        // this gets fired twice for some reason
                        if (alreadyReading) {
                            return;
                        } else {
                            alreadyReading = true;
                        }
                        setTimeout(() => {
                            triggerRead();
                        }, timeout);
                    });
                    saxStream.on('opentag', (node) => {
                        output.push(node.name);
                    });

                    saxStream.on('end', () => {
                        // index of first message should be after the delay times
                        resolve(output.indexOf('message'));
                    });

                    bylineStream.pipe(saxStream);
                });
            },
        });

        runTest({
            description: 'we should be able to track when the sax parser is finished',
            expect: 8,
            test: async () => {
                return new Promise<number>((resolve, reject) => {
                    const readStream = createReadStream(getSampleFilePath('simple-example.xml'));
                    const bylineStream = byline.createStream(readStream);
                    const saxParser = sax.parser(true);
                    const output: string[] = [];
                    let readCallIndex = 0;
                    const timeout = 0;

                    saxParser.onopentag = (node) => {
                        output.push(node.name);
                    };

                    saxParser.onend = () => {
                        setTimeout(() => triggerRead(), timeout);
                    };

                    saxParser.onerror = () => {
                        saxParser.resume();
                    };

                    function triggerRead() {
                        ++readCallIndex;
                        if (readCallIndex > 4) {
                            const line = bylineStream.read();
                            if (line == null) {
                                resolve(output.indexOf('message'));
                            } else {
                                readCallIndex = 0;
                                saxParser.write(line).close();
                            }
                        } else {
                            output.push(String(readCallIndex));
                            setTimeout(() => {
                                triggerRead();
                            }, timeout);
                        }
                    }

                    let alreadyReading = false;

                    bylineStream.on('readable', () => {
                        // this gets fired twice for some reason
                        if (alreadyReading) {
                            return;
                        } else {
                            alreadyReading = true;
                        }
                        setTimeout(() => {
                            triggerRead();
                        }, timeout);
                    });
                });
            },
        });

        runTest({
            description:
                "sax parser can't track what tag we're on when the xml is broken up by line",
            expectError: {
                errorClass: TypeError,
            },
            test: async () => {
                return new Promise<number>((resolve, reject) => {
                    const readStream = createReadStream(getSampleFilePath('simple-example.xml'));
                    const bylineStream = byline.createStream(readStream);
                    const saxParser = sax.parser(true);
                    const output: string[] = [];
                    let readCallIndex = 0;
                    const timeout = 0;

                    saxParser.onopentag = (node) => {
                        output.push(node.name);
                    };

                    saxParser.ontext = (text) => {
                        try {
                            output.push(`${saxParser.tag.name}:${text}`);
                        } catch (error) {
                            // test errors out here
                            reject(error);
                        }
                    };

                    saxParser.onend = () => {
                        setTimeout(() => triggerRead(), timeout);
                    };

                    saxParser.onerror = () => {
                        saxParser.resume();
                    };

                    function triggerRead() {
                        ++readCallIndex;
                        if (readCallIndex > 4) {
                            const line = bylineStream.read();
                            if (line == null) {
                                resolve(output.indexOf('message'));
                            } else {
                                readCallIndex = 0;
                                saxParser.write(line).close();
                            }
                        } else {
                            output.push(String(readCallIndex));
                            setTimeout(() => {
                                triggerRead();
                            }, timeout);
                        }
                    }

                    let alreadyReading = false;

                    bylineStream.on('readable', () => {
                        // this gets fired twice for some reason
                        if (alreadyReading) {
                            return;
                        } else {
                            alreadyReading = true;
                        }
                        setTimeout(() => {
                            triggerRead();
                        }, timeout);
                    });
                });
            },
        });

        runTest({
            description: 'byline preserves whitespace',
            expect: '    <body color="red">',
            test: async () => {
                return new Promise<string>((resolve, reject) => {
                    const readStream = createReadStream(getSampleFilePath('simple-example.xml'));
                    const bylineStream = byline.createStream(readStream);
                    const lines: string[] = [];
                    let readCallIndex = 0;
                    const timeout = 0;

                    function triggerRead() {
                        ++readCallIndex;
                        if (readCallIndex > 4) {
                            const line = bylineStream.read();
                            readCallIndex = 0;

                            if (line == null) {
                                resolve(lines[5] || '');
                            } else {
                                lines.push(line.toString());
                                setTimeout(() => {
                                    triggerRead();
                                }, timeout);
                            }
                        } else {
                            setTimeout(() => {
                                triggerRead();
                            }, timeout);
                        }
                    }

                    let alreadyReading = false;

                    bylineStream.on('readable', () => {
                        // this gets fired twice for some reason
                        if (alreadyReading) {
                            return;
                        } else {
                            alreadyReading = true;
                        }
                        setTimeout(() => {
                            triggerRead();
                        }, timeout);
                    });
                });
            },
        });
    },
});
