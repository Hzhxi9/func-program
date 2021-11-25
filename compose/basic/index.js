/**
 * 面向过程
 *
 * 思路:
 *  使用递归的过程思想, 不断的检测队列中是否还有任务
 *  如果有任务就执行，并把执行结果往后传递，这里是一个局部的思维，无法预知任务何时结束。
 *  直观上最容易结束和理解
 **/
function compose(...args) {
  const len = args.length;
  let count = len - 1,
    result;

  return function func(...args1) {
    result = args[count].apply(this, args1);
    if (count <= 0) {
      count = len - 1;
      return result;
    }
    count--;
    return func.call(null, result);
  };
}

module.exports = compose;
