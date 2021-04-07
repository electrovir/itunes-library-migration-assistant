import {readFileSync} from 'fs';
import {parseXml} from 'libxmljs';
import {testGroup} from 'test-vir';
import {getSampleFilePath} from '../file-paths';

testGroup({
    description: 'simple xml-js usage',
    tests: (runTest) => {
        runTest({
            description: 'parse a simple xml file into json',
            test: () => {
                const simpleExampleFilePath = getSampleFilePath('simple-example.xml');
                const simpleJson = parseXml(readFileSync(simpleExampleFilePath).toString());
                // console.log(
                //     simpleJson
                //         .root()
                //         ?.childNodes()
                //         .map((node) => node.type()),
                // );
            },
        });

        runTest({
            description: 'parse a sample iTunes library xml file into json',
            test: () => {
                const sampleLibraryFilePath = getSampleFilePath('library-example.xml');
                const libraryJson = parseXml(readFileSync(sampleLibraryFilePath).toString());
                // console.log(libraryJson.root()?.childNodes());
            },
        });
    },
});
