function curry(fn, placeholder = [], ...args) {
  const length = fn.length;
  return function (...args2) {
    const _args = args.slice(),
      _placeholder = placeholder.slice(),
      argsLen = args.length,
      placeholderLen = placeholder.length,
      index = 0;

    for (const arg of args2) {
      /**
       * 处理类似 fn(1, _, _, 4)(_, 3) 这种情况
       * index 需要指向 holes 正确的下标
       */
      if (arg === _ && placeholderLen) {
        index++;
        if (index > placeholderLen) {
          _args.push(arg);
          _placeholder.push(argsLen - 1 + index - placeholderLen);
        }
      } else if (arg === _) {
        /**处理类似 fn(1)(_) 这种情况 */
        _args.push(arg);
        _placeholder.push(argsLen + 1);
      } else if (placeholderLen) {
        /**处理类似 fn(_, 2)(1) 这种情况 */
        if (index >= placeholderLen) {
          /**n(_, 2)(_, 3) */
          _args.push(arg);
        } else {
          /**fn(_, 2)(1) 用参数 1 替换占位符 */
          _args.splice(_placeholder[index], 1, arg);
          _placeholder.splice(index, 0);
        }
      } else {
        _args.push(arg);
      }
    }
    if (_placeholder.length || _args.length < length) {
      return curry.call(this, fn, _args, _placeholder);
    } else {
      return fn.apply(this, _args);
    }
  };
}
