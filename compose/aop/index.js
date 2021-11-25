/**
 * 函数交织(AOP)
 *
 * 思路:
 *  这个实现的灵感来自javascript设计模式中的高阶函数
 *  因为compose的任务在本质上就是函数执行，再加上顺序
 *  所以可以把实现顺序执行放到函数本身，对函数的原型进行方法的绑定。
 *  方法的作用对象是函数，面向对象封装的数据，面向函数封装的是函数的行为。
 *
 * 实现步骤
 *  需要对函数绑定两个行为 before 和 after
 *  before执行函数多元部分（启动）
 *  after执行函数单元部分
 */
Function.prototype.before = function (fn) {
  const self = this;
  return function (...args) {
    const result = fn.apply(null, args);
    return self.call(null, result);
  };
};

Function.prototype.after = function (fn) {
  const self = this;
  return function (...args) {
    const result = self.apply(null, args);
    return fn.call(null, result);
  };
};

/**
 * 这里对函数进行方法的绑定
 * 返回的是带着函数执行的规则的另外一个函数
 * 在这里是次序的排列规则，对返回的函数依然可以进行链式调用
 */
const compose = function (...args) {
  const before = args.pop();
  const start = args.pop();
  if (args.length) {
    return args.reduce(function (f1, f2) {
      return f1.after(f2);
    }, start.before(before));
  }
  return start.before(before);
};

module.exports = compose
