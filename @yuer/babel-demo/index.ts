import { template } from '@babel/core';
import { arrayExpression } from '@babel/types';
export default () => {
    const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);
    return {
        visitor: {
            CallExpression(path: any, state: any) {
                if (path.node.isNew) {
                    return;
                }
                const calleeName = path.get('callee').toString();
                if (targetCalleeName.includes(calleeName)) {
                    const { line, column } = path.node.loc.start;
                    const newNode = template.expression(`console.log("${ 'unkown filename'}: (${line}, ${column})")`)() as any;
                    newNode.isNew = true;

                    if (path.findParent((path: any) => path.isJSXElement())) {
                        path.replaceWith(arrayExpression([newNode, path.node]))
                        path.skip();
                    } else {
                        path.insertBefore(newNode);
                    }
                }
            }
        }
    }
}