const compose = function (...funcs) {
  const len = funcs.length;
  if (len === 0) return args => args;
  if (len === 1) return funcs[0];
  return funcs.reduce(pipe);
};

const pipe =
  (acc, cur) =>
  (...args) =>
    acc(cur(...args));

const init = (...args) => args.reduce((acc, cur) => acc + cur, 0);

const fn1 = value => value + 1;
const fn2 = value => value + 2;
const fn3 = value => value + 3;

const fns = [fn3, fn2, fn1, init];

const fnsCompose = compose(...fns);

console.log(fnsCompose(1, 2, 3));

const curry = (fn, ...args) => {
  return function (...args2) {
    const _args = [...args, ...args2];
    if (fn.length > _args.length) return curry.call(this, fn, ..._args);
    return fn.apply(this, _args);
  };
};

const fn = (a, b, c) => a + b + c;

const sum = curry(fn)

console.log(sum(1)(2)(3))

console.log(sum(1)(2,3))