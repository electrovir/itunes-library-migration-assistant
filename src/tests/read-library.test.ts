import {testGroup} from 'test-vir';
import {readLibrary} from '../migration/read-library';
import {getOutputFilePath, getSampleFilePath} from './file-paths';

testGroup({
    tests: (runTest) => {
        runTest({
            description: 'can read small sample library',
            test: () => {
                readLibrary(getSampleFilePath('library-example.xml'));
            },
        });
        runTest({
            description: 'can read full library',
            test: () => {
                readLibrary(getOutputFilePath('library.xml'));
            },
        });
    },
});
