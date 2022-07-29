const { transformFileSync } = require('@babel/core');
import { dirname } from "path";
import { fileURLToPath } from "url";
import trackerPlugin from '../tracker';
const path = require('path');


const __dirname = dirname(fileURLToPath(import.meta.url));
describe("tracker", () => {
    it("auto tracker", () => {
        const { code } = transformFileSync(path.join(__dirname, './trackerSource.js'), {
            root: __dirname,
            parserOpts: {
                plugins: ['jsx']
            },
            plugins: [[trackerPlugin, {
                trackerPath: 'tracker'
            }]],
        });

        expect(code).toMatchSnapshot();
    })
})