import * as fastXmlParser from 'fast-xml-parser';
import {createReadStream, existsSync, readFileSync} from 'fs';
import * as htmlparser2 from 'htmlparser2';
import * as libxmljs from 'libxmljs';
import * as sax from 'sax';
import {testGroup} from 'test-vir';
import * as txml from 'txml';
import * as xmlJs from 'xml-js';
import * as xml2js from 'xml2js';
import {getOutputFilePath} from '../../file-paths';
import {readLibraryByLine} from './library-line-reader';

testGroup((runTest) => {
    const libraryPath = getOutputFilePath('library.xml');
    if (!existsSync(libraryPath)) {
        return runTest(() => {
            console.log(`Add your library to "${libraryPath}" to run the speed test.`);
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
                    console.log('sax stream time milliseconds', diff);
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
                    console.log('sax parser time milliseconds', diff);
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
         * This takes ~2 seconds for my library but it doesn't preserve ordering of tags so its
         * output is useless
         */
        test: () => {
            const startTime = Number(new Date());
            const parserOptions: Partial<fastXmlParser.X2jOptions> = {};
            const libraryJson = fastXmlParser.convertToJson(
                fastXmlParser.getTraversalObj(readFileSync(libraryPath).toString(), parserOptions),
                parserOptions,
            );
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
            const libraryJson = await xml2js.parseStringPromise(
                readFileSync(libraryPath).toString(),
                {
                    explicitChildren: true,
                    preserveChildrenOrder: true,
                },
            );
            const endTime = Number(new Date());

            const diff = endTime - startTime;
            console.log('xml2js time milliseconds', diff);
        },
    });
    runTest({
        description: 'read the whole file into txml',
        /** Txml gives us an object that we need and takes 1-2 seconds for parsing. */
        test: () => {
            const startTime = Number(new Date());
            const libraryJson = txml.parse(readFileSync(libraryPath).toString());
            const endTime = Number(new Date());

            const diff = endTime - startTime;
            console.log('txml time milliseconds', diff, '<< use this one');
        },
    });
    runTest({
        description: 'read the whole file into xml-js',
        /** Xml-js provides useful data but it takes 6-7 seconds */
        test: () => {
            const startTime = Number(new Date());
            const libraryJson = xmlJs.xml2js(readFileSync(libraryPath).toString());
            const endTime = Number(new Date());

            const diff = endTime - startTime;
            console.log('xml-js time milliseconds', diff);
        },
    });
    runTest({
        description: 'read the whole file into libxmljs',
        /** Libxmljs provides useful data but it takes ~5 seconds */
        test: () => {
            const startTime = Number(new Date());
            const libraryJson = libxmljs.parseXml(readFileSync(libraryPath).toString());
            const endTime = Number(new Date());

            const diff = endTime - startTime;
            console.log('libxmljs time milliseconds', diff);
        },
    });
    runTest({
        description: 'read the whole file into readLibraryByLine',
        /** This does not work and takes ~900 milliseconds */
        test: async () => {
            const startTime = Number(new Date());
            const matches = await readLibraryByLine(libraryPath);
            const endTime = Number(new Date());

            const diff = endTime - startTime;
            console.log('readLibrary time milliseconds', diff);
        },
    });
    runTest({
        description: 'read the whole file into htmlparser2',
        /** This takes about as long as txml (1-2 seconds) but doesn't product as useful of a result */
        test: async () => {
            return new Promise<void>((resolve) => {
                const startTime = Number(new Date());
                const parser = new htmlparser2.Parser({
                    onend() {
                        const endTime = Number(new Date());
                        const diff = endTime - startTime;
                        console.log('htmlparser2 time milliseconds', diff);
                        resolve();
                    },
                });
                parser.write(readFileSync(libraryPath).toString());
                parser.end();
            });
        },
    });
});
