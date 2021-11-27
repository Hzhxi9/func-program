const pipe =
  (acc, cur) =>
  (...args) =>
    acc(cur(...args));

const compose = (...funcs) => {
  const len = funcs.length;
  if (len === 0) return args => args;
  if (len === 1) return funcs[0];
  return funcs.reduce(pipe);
};

const init = (...args) => args.reduce((acc, cur) => acc + cur, 0);
const fn1 = value => value + 1;
const fn2 = value => value + 2;
const fn3 = value => value + 3;

const fns = [fn3, fn2, fn1, init]

const com = compose(...fns)

console.log(com(1, 2, 3))