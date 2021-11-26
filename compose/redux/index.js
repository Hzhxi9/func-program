/**
 * redux源码中的compos
 * 它执行的顺序是函数集合中的函数从后往前执行
 */
function compose(...funcs) {
  const len = funcs.length;
  if (len === 0) return args => args;
  if (len === 1) return funcs[0];
  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}

module.exports = compose