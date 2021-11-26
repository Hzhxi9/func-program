/**
 * redux源码中的compos
 * 它执行的顺序是函数集合中的函数从后往前执行
 */
const pipe =
  (a, b) =>
  (...args) =>
    a(b(...args));

const compose = function (...funcs) {
  const len = funcs.length;
  if (len === 0) return args => args;
  if (len === 1) return funcs[0];
  return funcs.reduce(pipe);
};

module.exports = compose;
