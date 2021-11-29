function curry(fn, args = [], holes = []) {
  const length = fn.length;

  return function () {
    const _args = args.slice(),
      _holes = holes.slice(),
      argsLen = args.length,
      holesLen = holes.length;
      
    let index = 0;

    for (let i = 0, len = arguments.length; i < len; i++) {
      const arg = arguments[i];
      if (arg === _ && holesLen) {
        /**
         * 处理类似 fn(1, _, _, 4)(_, 3) 这种情况
         * index 需要指向 holes 正确的下标
         */
        index++;
        if (index > holesLen) {
          _args.push(arg);
          _holes.push(argsLen - 1 + index - holesLen);
        }
      } else if (arg === _) {
        /**处理类似 fn(1)(_) 这种情况 */
        _args.push(arg);
        _holes.push(argsLen + i);
      } else if (holesLen) {
        /**处理类似 fn(_, 2)(1) 这种情况 */
        if (index >= holesLen) {
          /**fn(_, 2)(_, 3) */
          _args.push(arg);
        } else {
          /**fn(_, 2)(1) 用参数 1 替换占位符 */
          _args.splice(_holes[index], 1, arg);
          _holes.splice(index, 1);
        }
      } else {
        _args.push(arg);
      }
    }
    if (_holes.length || _args.length < length) {
      return curry.call(this, fn,  _args, _holes);
    } else {
      return fn.apply(this, _args);
    }
  };
}

let _ = {};

let fn = curry(function (a, b, c, d, e) {
  console.log([a, b, c, d, e]);
});

fn(1, 2, 3, 4, 5);
fn(_, 1, 2, 3, 4)(5);
fn(1, _, 3, 4, 5)(2)
fn(1, _, 3)(_, 4)(2)(5);
fn(1, _, _, 4)(_, 3)(2)(5);
fn(_, 2)(_, _, 4)(1)(3)(5)