
import { NodePath } from '@babel/core';
import { Scopable } from '@babel/types';
const base54 = (function () {
    var DIGITS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
    return function (num) {
        var ret = "";
        do {
            ret = DIGITS.charAt(num % 54) + ret;
            num = Math.floor(num / 54);
        } while (num > 0);
        return ret;
    };
})();


export default () => {
    return {
        pre(file) {
            file.set('uid', 0);
        },
        visitor: {
            Scopable: {
                exit(path: NodePath<Scopable>, state) {
                    let uid = state.file.get('uid');
                    Object.entries(path.scope.bindings).forEach(([key, binding]) => {
                        if (binding.mangled) {
                            return true;
                        }
                        binding.mangled = true;
                        const newName = path.scope.generateUid(base54(uid++));
                        binding.path.scope.rename(key, newName)
                    });
                    state.file.set('uid', uid)
                }
            }
        }
    }
}