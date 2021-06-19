/**
 * This file is unused now because libxmljs is no longer installed as part of this package because
 * the installation process takes an entire minute!
 */

// import {readFileSync} from 'fs';
// import {parseXml} from 'libxmljs';
// import {testGroup} from 'test-vir';
// import {getSampleFilePath} from '../file-paths';

// testGroup({
//     description: 'simple xml-js usage',
//     tests: (runTest) => {
//         runTest({
//             description: 'parse a simple xml file into json',
//             test: () => {
//                 const simpleExampleFilePath = getSampleFilePath('simple-example.xml');
//                 const simpleJson = parseXml(readFileSync(simpleExampleFilePath).toString());
//             },
//         });

//         runTest({
//             description: 'parse a sample iTunes library xml file into json',
//             test: () => {
//                 const sampleLibraryFilePath = getSampleFilePath('library-example.xml');
//                 const libraryJson = parseXml(readFileSync(sampleLibraryFilePath).toString());
//             },
//         });
//     },
// });
