import type { NodePath } from '@babel/core';
import { addDefault } from '@babel/helper-module-imports';
import { Program } from '@babel/types';

export default (api: any, options: any) => {
    return {
        visitor: {
            Program: {
                enter(path: NodePath<Program>, state) {
                    path.traverse({
                        ImportDeclaration(curPath) {
                            const requirePath = curPath.get('source').node.value;
                            if (requirePath == options.trackerPath) { // 已经引入
                                const specifierPath = curPath.get('specifiers.0') as any;
                                if (specifierPath.isImportSpecifier()) {
                                    state.trackerImportId = specifierPath.toString();
                                } else if (specifierPath.isImportNamespaceSpecifier()) {
                                    state.trackerImportId = specifierPath.get('local').toString();
                                }
                                path.stop();//找到了，终止遍历
                            }
                        }
                    });
                    if (!state.trackerImportId) {
                        state.trackerImportId = addDefault(path, 'tracker', {
                            nameHint: path.scope.generateUidIdentifier('tracker')
                        }).name;// tracker的模拟id
                        state.trackerAST = api.template.statement(`${state.trackerImportId}()`)()//
                    }
                }
            },
            'ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration'(path, state) {
                const bodyPath = path.get('body');
                if (bodyPath.isBlockStatement()) {
                    bodyPath.node.body.unshift(state.trackerAST);
                } else {
                    const ast = api.template.statement(`{${state.trackerImportId}();return PREV_BODY;}`)({ PREV_BODY: bodyPath.node });
                    bodyPath.replaceWith(ast);
                }
            }
        }
    }
}