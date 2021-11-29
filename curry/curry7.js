const curry =
  (fn, arr = []) =>
  (...args) =>
    (arg => (arg.length === fn.length ? fn(...arg) : curry(fn, arg)))([...arr, ...args]);

const fn = (a, b, c, d) => a + b + c + d;

const sum = curry(fn);

console.log(sum(1)(2)(3)(4));
