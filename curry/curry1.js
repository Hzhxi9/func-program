// const curry = function (fn, ...args) {
//   return function (...args2) {
//     return fn.call(this, ...args, ...args2);
//   };
// };

// 第一版
const curry = function (fn) {
    var args = [].slice.call(arguments, 1);
    return function() {
        var newArgs = args.concat([].slice.call(arguments));
        return fn.apply(this, newArgs);
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