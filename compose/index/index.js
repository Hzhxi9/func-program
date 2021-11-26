/**
 * 用一个函数解决问题 => compose(fn1, fn2, fn1, fn3)(6)
 * 函数调用的扁平化，即把层级嵌套的那种函数调用(一个函数的运行结果当作实参传给下一个函数的这种操作)扁平化
 * @param  {...any} funcs 传递函数集合
 */
function compose(...funcs) {
  /**
   * compose函数执行后跟个()，说明函数执行完再执行一个函数
   * 即函数执行完会返回一个新函数，而且也会给出第一次调用函数时的参数
   * @param {...any} 第一次调用函数传递的参数集合
   */
  return function proxy(...args) {
    const len = funcs.length;
    /**没有传入函数, 不需要执行直接返回args */
    if (len === 0) return args;
    /**传一个函数, 需把后一个的参数赋给这个函数, 把函数执行, 把其结果返回即可 */
    if (len === 1) return funcs[0](...args);
    /**传两个函数以上, 那就是把前一个函数的执行结果赋给后一个函数 */
    return funcs.reduce((x, y) => {
      /**需要注意: 第一次执行, 参数x是一个函数, 之后再执行的时候x是函数执行的结果 */
      return typeof x === 'function' ? y(x(...args)) : y(x);
    });
  };
}

module.exports = compose
