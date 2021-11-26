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

/**
 * f1 = (...args) => step2.call(null, init.apply(null, args))
 * f2 = (...args) => step3.call(null, step2.apply(null, args))
 * f3 = (...args) => step4.call(null, step3.apply(null, args))
 * @param {*} f 上一个函数
 * @param {*} g 当前函数
 * @returns 
 */
const _pipe =
  (f, g) =>
  (...args) =>
    g.call(null, f.apply(null, args));

const compose = (...funcs) => funcs.reduceRight(_pipe, funcs.pop());

module.exports = compose;
