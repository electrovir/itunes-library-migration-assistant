import {convertToJson, X2jOptions} from 'fast-xml-parser';
import {createReadStream, existsSync, readFileSync} from 'fs';
import * as sax from 'sax';
import {testGroup} from 'test-vir';
import * as txml from 'txml';
import {parseStringPromise} from 'xml2js';
import {getOutputFilePath} from '../file-paths';

testGroup((runTest) => {
    const libraryPath = getOutputFilePath('library.xml');
    if (!existsSync(libraryPath)) {
        return runTest(() => {
            console.log(`Add your library to "${libraryPath}" to run the speed test.`);
            // do nothing so that this test group passes
        });
    }

    runTest({
        description: 'stream everything all at once with sax',
        /** This takes ~3 seconds for my library and does not give me a useful json object */
        test: () => {
            return new Promise((resolve, reject) => {
                // let nodeCount = 0;
                const saxStream = sax.createStream(true);

                saxStream.on('opentag', (node) => {
                    // ++nodeCount;
                });
                saxStream.on('error', (error) => {
                    reject(error);
                });

                saxStream.on('end', () => {
                    const endTime = Number(new Date());
                    const diff = endTime - startTime;
                    console.log('stream diff time milliseconds', diff);
                    resolve();
                });

                const startTime = Number(new Date());
                createReadStream(libraryPath).pipe(saxStream);
            });
        },
    });
    runTest({
        description: 'read the whole file into memory and then into sax',
        /**
         * This takes ~3 seconds for my library (same as the stream diff) and does not give me a
         * useful json object
         */
        test: () => {
            return new Promise(async (resolve, reject) => {
                // let nodeCount = 0;
                const saxParser = sax.parser(true);

                saxParser.onopentag = () => {
                    // ++nodeCount;
                };
                saxParser.onerror = (error) => {
                    reject(error);
                };
                saxParser.onend = () => {
                    const endTime = Number(new Date());
                    const diff = endTime - startTime;
                    console.log('parser diff time milliseconds', diff);
                    resolve();
                };

                const startTime = Number(new Date());
                const fileContents = readFileSync(libraryPath).toString();
                saxParser.write(fileContents).close();
            });
        },
    });
    runTest({
        description: 'read the whole file into fast-xml-parser',
        /**
         * This takes 100-200 milliseconds for my library but it doesn't preserve ordering of tags
         * so its output is useless
         */
        test: () => {
            const startTime = Number(new Date());
            const parserOptions: Partial<X2jOptions> = {};
            const libraryJson = convertToJson(readFileSync(libraryPath).toString(), parserOptions);
            const endTime = Number(new Date());

            const diff = endTime - startTime;
            console.log('fast xml time milliseconds', diff);
        },
    });
    runTest({
        description: 'read the whole file into xml2js',
        /**
         * Xml2js gives us a full json object that we can actually use (as it preserves order) but
         * it is the slowest I've tried so far at 6-8 seconds for my library
         */
        test: async () => {
            const startTime = Number(new Date());
            const libraryJson = await parseStringPromise(readFileSync(libraryPath).toString(), {
                explicitChildren: true,
                preserveChildrenOrder: true,
            });
            const endTime = Number(new Date());

            const diff = endTime - startTime;
            console.log('xml2js time milliseconds', diff);
        },
    });
    runTest({
        description: 'read the whole file into txml',
        /**
         * Xml2js gives us a full json object that we can actually use (as it preserves order) but
         * it is the slowest I've tried so far at 6-8 seconds for my library
         */
        test: () => {
            const startTime = Number(new Date());
            const libraryJson = txml.parse(readFileSync(libraryPath).toString());
            const endTime = Number(new Date());

            const diff = endTime - startTime;
            console.log('txml time milliseconds', diff);
        },
    });
});
