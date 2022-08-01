import { NodePath, template } from '@babel/core';
import { addDefault } from '@babel/helper-module-imports';
import { ImportDeclaration, isBlockStatement, isImportNamespaceSpecifier, isImportSpecifier } from '@babel/types';

export default (_, option) => {
    return {
        visitor: {
            Program: {
                enter(path, state) {
                    path.traverse({
                        ImportDeclaration(currPath: NodePath<ImportDeclaration>) {
                            const importPath = (currPath.get('resource') as any).value;
                            if (importPath == option.stackerPath) {
                                const specifierPath = currPath.get('specifiers.0') as any;
                                if (isImportSpecifier(specifierPath)) {
                                    state.trackerTemplateID =specifierPath.toString();
                                } else if (isImportNamespaceSpecifier(specifierPath)) {
                                    state.trackerTemplateID = specifierPath.get('local').toString()
                                }
                                path.stop();
                            }
                        }
                    });
                    if (!state.trackerTemplateID) {
                        state.templateID = addDefault(path, 'tracker', {
                            nameHint: path.scope.generateUid('tracker')
                        }).name;
                        state.trackerAST = template.statement(`${state.templateID}()`)()
                    }
                }
            },
            'ClassMethod|ArrowFunctionExpression|FunctionExpression|FunctionDeclaration'(path, state) {
                const bodyPath = path.get('body');
                if (isBlockStatement(bodyPath)) {
                    bodyPath.body.unshift(state.trackerAST)
                } else {
                    const ast = template.statement(`{${state.trackerAST};returnPREV_BODY; }`)
                    bodyPath.replaceWith(ast)
                }
            }

        }
    }
}