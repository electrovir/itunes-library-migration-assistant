import {readFileSync} from 'fs';
import {Parser} from 'htmlparser2';
import {testGroup} from 'test-vir';
import {getSampleFilePath} from '../file-paths';
import {syncWait} from './wait';

testGroup({
    description: 'simple htmlparser2 usage',
    tests: (runTest) => {
        runTest({
            description: 'parse a simple xml file and ensure ordering is preserved',
            expect: readFileSync(
                getSampleFilePath('htmlparser2-simple-example-comparison.txt'),
            ).toString(),
            test: async () => {
                return new Promise<string>((resolve) => {
                    const sampleLibraryFilePath = getSampleFilePath('simple-example.xml');
                    const results: string[] = [];

                    function insertStuff(input: string): void {
                        const trimmed = input.trim();
                        if (trimmed) {
                            results.push(trimmed);
                        }
                    }

                    const parser = new Parser({
                        onopentag(name) {
                            if (name === 'body') {
                                // one long wait
                                syncWait(500);
                            }
                            syncWait(50);
                            insertStuff(name);
                        },
                        ontext(text) {
                            insertStuff(text);
                        },
                        onend() {
                            // make sure that ordering is preserved.
                            // this is really just checking that the callbacks are synchronously called
                            resolve(results.join('\n'));
                        },
                    });
                    parser.write(readFileSync(sampleLibraryFilePath).toString());
                    parser.end();
                });
            },
        });
    },
});
