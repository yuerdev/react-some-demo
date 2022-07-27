import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import {isMemberExpression,stringLiteral} from '@babel/types';

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

const ast = parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx']
})

traverse(ast, {
    CallExpression(path, state) {
        if (isMemberExpression(path.node.callee)
            && path.node.callee.object.name == 'console'
            && ['log', 'info', 'error', 'table', 'debug'].includes(path.node.callee.property.name)) {

            const { line, column } = path.node.loc.start;
            path.node.arguments.unshift(stringLiteral(`fileinfo:(${line}:${column}) --`))
        }
    }
})

const { code, map } = generate(ast);
console.log(code);

describe("babel-demo", () => {
    it("should mark mixed", () => {
        expect(1).toEqual(1);
        expect(code).toMatchSnapshot();
    });
})