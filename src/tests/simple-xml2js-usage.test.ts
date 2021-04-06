import {readFileSync} from 'fs';
import {testGroup} from 'test-vir';
import {parseStringPromise} from 'xml2js';
import {getSampleFilePath} from '../file-paths';

/** Jfdasklfjd a fkjldajflkdasjl */
testGroup({
    description: 'simple xml2js usage',
    tests: (runTest) => {
        runTest({
            description: 'parse a simple xml file into json',
            test: async () => {
                const simpleExampleFilePath = getSampleFilePath('simple-example.xml');
                const simpleJson = await parseStringPromise(
                    readFileSync(simpleExampleFilePath).toString(),
                );
                // console.log(JSON.stringify(simpleJson, null, 4));
            },
        });

        runTest({
            description: 'parse a sample iTunes library xml file into json',
            test: async () => {
                const sampleLibraryFilePath = getSampleFilePath('library-example.xml');
                const libraryJson = await parseStringPromise(
                    readFileSync(sampleLibraryFilePath).toString(),
                    {explicitChildren: true, preserveChildrenOrder: true},
                );
                // console.log(JSON.stringify(libraryJson, null, 4));
            },
        });
    },
});
