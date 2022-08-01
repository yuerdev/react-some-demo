// import { transformSync } from "@babel/core";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import Linter from "../linter";

// const __dirname = dirname(fileURLToPath(import.meta.url));

// const compileToSnapshot = (code: string) => {
//     const t = transformSync(code, {
//         root: __dirname,
//         parserOpts: {
//             plugins: ["jsx"],
//         },
//         plugins: [[Linter,{
//             fix: true
//         }]],
//     });

//     return `
// ${code}
    
// ↓ ↓ ↓ ↓ ↓ ↓

// ${t?.code}  
// `;
// };

// describe("for direction", () => {
//     it("should direction", () => {
//         const result = compileToSnapshot(`
//         for (var i = 0; i < 10; i++) {
//         }
        
//         for (var i = 10; i >= 0; i--) {
//         }
//         for (var i = 0; i < 10; i--) {
//         }
        
//         for (var i = 10; i >= 0; i++) {
//         }
//     `);

//         expect(result).toMatchSnapshot();
//     });
    
//     it(" ==", () => {
//         const result = compileToSnapshot(`
//         a == b
//         foo == true
//         bananas != 1
//         value == undefined
//         typeof foo == 'undefined'
//         'hello' != 'world'
//         0 == 0
//         true == true
//     `);

//         expect(result).toMatchSnapshot();
//     });
// });