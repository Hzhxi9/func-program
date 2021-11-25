/**
 * Generator
 *
 * Generator主要使用yield来构建协程，采用中断，处理，再中断的流程。
 * 可以事先规定好协程的执行顺序，然后再下次处理的时候进行参数（结果）交接
 *
 * 有一点要注意的是，由于执行的第一个next是不能传递参数的，
 * 所以第一个函数的执行需要手动调用
 * 再空耗一个next，
 * 后面的就可以同步执行了。
 */

/**generator 构建 */
function* iterateSteps(steps) {
  let n;
  for (let i = 0, len = steps.length; i < len; i++) {
    if (n) n = yield steps[i].call(null, n);
    else n = yield;
  }
}

/**compose 实现 */
const compose = function (...steps) {
  const g = iterateSteps(steps);
  return function (...args) {
    /**第一个值 */
    const val = steps.pop().apply(null, args);
    /**因为无法传参数 所以无所谓执行 就是空耗一个yield */
    g.next();
    return steps.reverse.reduce((val, val1) => g.next(val).value, val);
  };
}

module.exports = compose