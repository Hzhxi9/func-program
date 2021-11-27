/**第二版 */
function sub(fn, ...args) {
  return function (...args2) {
    return fn.call(this, ...args, ...args2);
  };
}

function curry(fn, length = fn.length) {
  return function (...args) {
    if (args.length < length) return curry(sub.call(this, fn, ...args), length - arguments.length);
    return fn.apply(this, arguments);
  };
}

function add(a, b, c) {
  return a + b + c;
}

var addCurry = curry(add);

console.log(addCurry(1, 2, 3));
console.log(addCurry(1, 2)(3));
console.log(addCurry(1)(2)(3));
