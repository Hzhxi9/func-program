function curry(fn) {
  let args = [];
  return function proxy(..._args) {
    if (_args.length) {
      /**有参数就合并进去，然后返回自身 */
      args = [...args, ..._args];
      return proxy;
    } else {
      /**没有参数了，也就是最后一个了，执行累计结果操作并返回结果 */
      const tmp = fn.apply(this, args);
      args = [];
      return tmp;
    }
  };
}
const add = (...args) => args.reduce((acc, cur) => acc + cur, 0);

const sum = curry(add);

console.log(sum(1, 2, 3)());
console.log(sum(1)(2)(3)(4)());
