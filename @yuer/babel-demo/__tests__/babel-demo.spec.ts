const { transformFileSync } = require('@babel/core');
const insertParametersPlugin = require('../babel-demo');
const path = require('path');

describe("babel-demo", () => {
    it("babel-demo", () => {
        const { code } = transformFileSync(path.join(__dirname, './sourceCode.js'), {
            plugins: [insertParametersPlugin],
            parserOpts: {
                sourceType: 'unambiguous',
                plugins: ['jsx']
            }
        });

        expect(code).toMatchSnapshot();
    })
})