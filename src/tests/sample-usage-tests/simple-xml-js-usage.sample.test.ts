import {readFileSync} from 'fs';
import {testGroup} from 'test-vir';
import {xml2js} from 'xml-js';
import {getSampleFilePath} from '../../file-paths';

testGroup({
    description: 'simple xml-js usage',
    tests: (runTest) => {
        runTest({
            description: 'parse a simple xml file into json',
            test: () => {
                const simpleExampleFilePath = getSampleFilePath('simple-example.xml');
                const simpleJson = xml2js(readFileSync(simpleExampleFilePath).toString());
            },
        });

        runTest({
            description: 'parse a sample iTunes library xml file into json',
            test: () => {
                const sampleLibraryFilePath = getSampleFilePath('library-example.xml');
                const libraryJson = xml2js(readFileSync(sampleLibraryFilePath).toString());
            },
        });
    },
});
