import { transformSync } from "@babel/core";
import { dirname } from "path";
import { fileURLToPath } from "url";
import MixZip from "../mix";

const __dirname = dirname(fileURLToPath(import.meta.url));

const compileToSnapshot = (code: string) => {
    const t = transformSync(code, {
        root: __dirname,
        parserOpts: {
            plugins: ["jsx"],
        },
        plugins: [[MixZip]],
    });

    return `
${code}
    
↓ ↓ ↓ ↓ ↓ ↓

${t?.code}  
`;
};

describe("mix test", () => {
    it("mix", () => {
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