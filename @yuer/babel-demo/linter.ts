import { NodePath } from "@babel/core";
import { BinaryExpression, ForStatement, isLiteral, UpdateExpression } from "@babel/types";

export default () => {
    return {
        pre(file) {
            file.set('errors', []);
        },
        visitor: {
            ForStatement(path: NodePath<ForStatement>, state) {
                const errors = state.file.get('errors');
                const testOperator = (path.node.test as BinaryExpression).operator;
                const updateOperator = (path.node.update as UpdateExpression).operator;
                let shouldUpdateOperator = ''
                if (['<', '<='].includes(testOperator)) {
                    shouldUpdateOperator = '++';
                } else if (['>', '>='].includes(testOperator)) {
                    shouldUpdateOperator == '--';
                }
                if (shouldUpdateOperator !== updateOperator) {
                    const tmp = Error.stackTraceLimit;
                    Error.stackTraceLimit = 0;
                    errors.push(path.get('update').buildCodeFrameError("for direction error", Error));
                    Error.stackTraceLimit = tmp;
                }
            },
            BinaryExpression(path: NodePath<BinaryExpression>, state) {
                const errors = state.file.get('errors');
                if (['==', '!='].includes(path.node.operator)) {
                    const left = path.get('left');
                    const right = path.get('right');
                    if (!(isLiteral(left) && isLiteral(right) && typeof left.node.value === typeof right.node.value)) {
                        const tmp = Error.stackTraceLimit;
                        Error.stackTraceLimit = 0;
                        errors.push(path.buildCodeFrameError(`please replace ${path.node.operator} with ${path.node.operator + '='}`, Error));
                        Error.stackTraceLimit = tmp;
                        // 自动修复
                        if (state.opts.fix) {
                            path.node.operator = path.node.operator + '=';
                        }
                    }
                }
            },
        },
        post(file) {
            console.log(file.get('errors'));
        }
    }
}