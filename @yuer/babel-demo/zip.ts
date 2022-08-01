
import { NodePath } from '@babel/core';
import { BlockStatement, expressionStatement, isCallExpression, isCompletionStatement, isFunctionDeclaration, isVariableDeclaration, Scopable } from '@babel/types';

const canExistAfterCompletion = (path) => {
    return isFunctionDeclaration(path) || isVariableDeclaration(path, {
        kind: "var"
    });
}

export default () => {
    return {
        pre(file) {
            file.set('uid', 0);
        },
        visitor: {
            BlockStatement(path: NodePath<BlockStatement>) {
                const statementPaths = path.get('body');
                let purge = false;
                for (let i = 0; i < statementPaths.length; i++) {
                    //代码在break continue return throw之后
                    if (isCompletionStatement(statementPaths[i])) {
                        purge = true;
                        continue;
                    }

                    if (purge && !canExistAfterCompletion(statementPaths[i])) {
                        statementPaths[i].remove();
                    }
                }
            },
            Scopable(path: NodePath<Scopable>) {
                Object.entries(path.scope.bindings).forEach(([key, binding]) => {
                    if (!binding.referenced) {// 没有被引用
                        if (isCallExpression(binding.path.get('init'))) {
                            const comments = binding.path.get('init').node.leadingComments;//节点签的注释
                            if (comments && comments[0]) {
                                if (comments[0].value.includes('PURE')) {
                                    binding.path.remove();
                                    return;
                                }
                            }
                        }
                        if (!path.scope.isPure(binding.path.node.init)) {//如果是纯，删除，否则替换为右边部分
                            binding.path.parentPath?.replaceWith(expressionStatement(binding.path.node.init));
                            
                        } else {
                            binding.path.remove()
                        }
                    }
                })
            }
        }
    }
}