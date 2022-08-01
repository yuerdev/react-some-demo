import { transformSync } from "@babel/core";
import { dirname } from "path";
import { fileURLToPath } from "url";
import Mix from "../mix";
import Zip from "../zip";

const __dirname = dirname(fileURLToPath(import.meta.url));

const compileToSnapshot = (code: string) => {
    const t = transformSync(code, {
        root: __dirname,
        parserOpts: {
            plugins: ["jsx"],
        },
        plugins: [[Zip], [Mix]],
        generatorOpts: {
            comments: false,
            compact: true
        }
    });

    return `
${code}
    
↓ ↓ ↓ ↓ ↓ ↓

${t?.code}  
`;
};

describe("zip mix test", () => {
    it("zip mix", () => {
        const result = compileToSnapshot(`
        function func() {
            const num1 = 1;
            const num2 = 2;
            const num3 = /*@__PURE__*/add(1, 2);
            const num4 = add(3, 4);
            console.log(num2);
            return num2;
            console.log(num1);
            function add (aaa, bbb) {
                return aaa + bbb;
            }
        }
        func();
    `);

        expect(result).toMatchSnapshot();
    });

});