import { parser } from '@babel/parser';
import * as traverse from '@babel/traverse';
import * as generate from '@babel/generator';

const sourceCode = `
    console.log(1);

    function func() {
        console.info(2);
    }

    export default class Clazz {
        say() {
            console.debug(3);
        }
        render() {
            return <div>{console.error(4)}</div>
        }
    }
`;

const ast = parser(sourceCode, {
  sourceType: 'unambiguous',
  plugins: ['jsx']
})

traverse(ast, {
  CallExpression(path, state) {

  }
})

const { code, map } = generate(ast);
console.log(code);