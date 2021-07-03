import {testGroup} from 'test-vir';
import {decodeLocation, encodeLocation} from '../augments/string';

testGroup({
    description: 'semicolon encoding',
    tests: (runTest) => {
        const original = 'BlahBlahBlah%3B%20BlahBlahBlahBlah%3B%20BlahBlahBlahBlahBlah.mp3';
        const decoded = 'BlahBlahBlah; BlahBlahBlahBlah; BlahBlahBlahBlahBlah.mp3';

        runTest({
            description: 'encoded and decoded original',
            expect: original,
            test: () => {
                return encodeLocation(decodeLocation(original));
            },
        });
        runTest({
            description: 'decoded original',
            expect: decoded,
            test: () => {
                return decodeLocation(original);
            },
        });
        runTest({
            description: 'encoded decoded',
            expect: original,
            test: () => {
                return encodeLocation(decoded);
            },
        });
    },
});
