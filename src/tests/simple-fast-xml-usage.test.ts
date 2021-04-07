import {convertToJson, getTraversalObj, parse, X2jOptions} from 'fast-xml-parser';
import {readFileSync} from 'fs';
import {testGroup} from 'test-vir';
import {getSampleFilePath} from '../file-paths';

testGroup({
    forceOnly: true,
    description: 'simple fast xml usage',
    // fast-xml-parser doesn't preserve ordering of tags and has no events so it is utterly useless
    tests: (runTest) => {
        runTest({
            description: 'parse a simple xml file into json',
            test: () => {
                const simpleExampleFilePath = getSampleFilePath('simple-example.xml');
                const parserOptions: Partial<X2jOptions> = {};
                const simpleJson = parse(
                    readFileSync(simpleExampleFilePath).toString(),
                    parserOptions,
                );
            },
        });

        runTest({
            description: 'parse a sample iTunes library xml file into json',
            test: () => {
                const sampleLibraryFilePath = getSampleFilePath('library-example.xml');
                const libraryJson = parse(readFileSync(sampleLibraryFilePath).toString());
                console.log('PARSE');
                console.log(JSON.stringify(libraryJson, null, 4));
            },
        });
        runTest({
            description: 'parse a sample iTunes library xml file into json',
            test: () => {
                const sampleLibraryFilePath = getSampleFilePath('library-example.xml');
                const parserOptions: Partial<X2jOptions> = {};
                const libraryJson = convertToJson(
                    getTraversalObj(readFileSync(sampleLibraryFilePath).toString(), parserOptions),
                    parserOptions,
                );
                console.log('CONVERTTOJSON');
                console.log(JSON.stringify(libraryJson, null, 4));
            },
        });
    },
});
