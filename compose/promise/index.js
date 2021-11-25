/**
 * Promise
 *
 * ES6引入了Promise
 * Promise可以指定一个sequence，来规定一个执行then的过程
 * then函数会等到执行完成后，再执行下一个then的处理
 * 启动sequence可以使用Promise.resolve()这个函数
 * 构建sequence可以使用reduce compose实现
 */
const compose = function (...args) {
  const init = args.pop();
  return function (...arg) {
    return args.reverse().reduce(function (sequence, func) {
      return sequence.then(function (result) {
        return func.call(null, result);
      });
    }, Promise.resolve(init.apply(null, arg)));
  };
};

module.exports = compose
