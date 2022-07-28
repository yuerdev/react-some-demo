const { transformFileSync } = require('@babel/core');
import { dirname } from "path";
import { fileURLToPath } from "url";
import insertParametersPlugin from '..';
const path = require('path');


const __dirname = dirname(fileURLToPath(import.meta.url));
describe("babel-demo", () => {
    it("babel-demo", () => {
        const { code } = transformFileSync(path.join(__dirname, './sourceCode.js'), {
            root: __dirname,
            parserOpts: {
                plugins: ['jsx']
            },
            plugins: [insertParametersPlugin],
        });

        expect(code).toMatchSnapshot();
    })
})