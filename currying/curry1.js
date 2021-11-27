const curry = function (fn) {
  const args = [].slice.call(arguments, 1);
  return function () {
    const arg = args.concat([].slice.call(arguments));
    return fn.apply(this, arg);
  };
};

function add(a, b) {
  return a + b;
}

var addCurry = curry(add, 1, 2);
console.log(addCurry())

addCurry(curry(add, 1))
console.log(addCurry())

addCurry(curry(add))
console.log(addCurry())