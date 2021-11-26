const compose = require('./index');

const init = (...args) => args.reduce((acc, cur) => acc + cur, 0);
const step2 = val => val + 2;
const step3 = val => val + 3;
const step4 = val => val + 4;

const steps = [init, step2, step3, step4];

/**
 * 拆分出来
 * 即把前一个函数的运行结果赋值给后一个函数
 */
const fn = compose(...steps);

console.log(fn(1,2,3))
