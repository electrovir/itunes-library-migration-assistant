import {testGroup} from 'test-vir';
import {readLibrary} from '../migration/read-library';
import {getSampleFilePath} from './file-paths';

testGroup({
    tests: (runTest) => {
        runTest({
            description: 'can read small sample library',
            test: () => {
                readLibrary(getSampleFilePath('library-example.xml'));
            },
        });
    },
});
