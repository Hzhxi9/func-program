/**bad */

const o = { x: 100 };

function fn(y) {
  this.x += y;
  console.log(this);
}

/**feat: 在1秒后，执行函数fn，并让其this指向o */

/**bad: fn函数中的this是指向window的，而且也没有传递参数 */
setTimeout(fn, 1000);

/**bad: this 指向依然是window, 而且相当于立即执行fn函数, 并且把结果赋值给定时器, 一秒后再执行, 这样肯定不行 */
setTimeout(fn(200), 1000);

/**bad: 使用call或者apply虽然改变了this指向, 但是都是函数立即执行并把返回结果赋给了定时器*/
setTimeout(fn.call(o, 200), 1000);

/**
 * good: 用一个匿名函数包装起来, 等到1秒后执行匿名函数里边的代码
 * 总结: 在某个阶段之后执行某些代码, 我们需要预先把this指向、参数等预先准备好, 这种预先处理的思想就是柯里化思想
 * 定义: 利用闭包的机制，把一些内容事先存储和处理了，等到后期需要的时候拿来用即可
 **/
setTimeout(function () {
  fn.call(o, 200);
}, 1000);

/**
 * good: 使用bind实现
 * 因为bind不会立即执行函数，而且可以预先存储一些内容，和柯理化函数的思想相似，但问题是bind不兼容IE8及以下。
 */
setTimeout(fn.bind(o, 200), 1000);

/**
 * 兼容: bind函数 预先处理内容
 * @param {*} func 要执行的函数
 * @param {*} ctx 需要改变的this指向
 * @param  {...any} args 给函数传递参数
 * @returns 返回一个代理函数
 */
function bind(func, ctx, ...args) {
  return function proxy() {
    /**call和apply兼容IE低版本 */
    func.call(ctx, ...args);
  };
}
