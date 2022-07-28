

export default  ({ template, types }) => {
    return {
        name:'babel-demo',
        visitor: {
            CallExpression(path) {
                const collectName = path.get('callee').toString();//const calleeName = path.get('callee').toString() 也行
                if (path.node.isNew) {
                    return
                }
                const targetCollectName = ['log', 'info', 'error', 'table', 'debug'].map(e => `console.${e}`)
                if (targetCollectName.includes(collectName)) {
                    const { line, column } = path.node.loc.start;
                    const newNode = template.expression(`console.log('filename:${line},${column}:')`)()
                    newNode.isNew = true
                    //兼容jsx
                    if (path.findParent(path => path.isJSXElement())) {
                        path.replaceWith(types.arrayExpression([newNode, path.node]))
                        path.skip()
                    } else {
                        path.insertBefore(newNode)
                    }
                }
            }
        }
    }
}