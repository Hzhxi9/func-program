function curry(fn, ...args) {
  const fnLen = fn.length;
  const _args = args.slice()
  return function (...innerArgs) {
    innerArgs = _args.concat(innerArgs)
    if (innerArgs.length < fnLen) return curry.call(this, fn, ...innerArgs);
    else return fn.apply(this, innerArgs);
  };
}

function fn(a, b, c, d) {
    return a + b + c + d
}

const sum = curry(fn);

console.log(sum(1)(2)(3)(4));
