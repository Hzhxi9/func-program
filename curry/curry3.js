function curry(fn, ...args) {
  const length = fn.length;
  return function (..._args) {
    const args_ = args.slice();
    for (const arg of _args) args_.push(arg);
    if (args_.length < length) return curry.call(this, fn, ...args_);
    return fn.apply(this, args_);
  };
}


function currying(fn, ...args) {
  return function (..._args) {
    const args_ = [...args, ..._args]
    if (fn.length > args_.length) return currying.call(this, fn, ...args_);
    else return fn.apply(this, args_);
  };
}

function add(a, b, c) {
  return a + b + c;
}

const addCurry = currying(add);

console.log(addCurry(1, 2, 3));
console.log(addCurry(1, 2)(3));
console.log(addCurry(1)(2)(3));