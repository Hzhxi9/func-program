/**
 * 函数组合
 *
 * 思路:
 *  这个思路是一种函数组合的思想
 *  将函数两两组合，不断的生成新的函数，生成的新函数挟裹了函数执行的逻辑信息
 *  然后再两两组合，不断的传递下去
 *  这种思路可以提前遍历所有任务，将任务组合成一个可以展开的组合结构
 *  最后执行的时候就像推导多米诺骨牌一样。
 */
const _pipe =
  (f, g) =>
  (...args) =>
    g.call(null, f.apply(null, args));
const compose = (...args) => args.reverse().reduce(_pipe, args.shift());

module.exports = compose