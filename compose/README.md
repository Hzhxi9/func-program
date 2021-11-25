# compose

## 什么是 compose

compose 就是执行一系列的任务（函数）

例如有以下任务队列: `const task = [step1, step2, step3, step4]`

每个 step 都是一个步骤, 按照步骤一步步地执行到结尾, 这就是一个 compose

实现 compose 有三点说明

- 第一个函数是多元的(接受多个参数), 后面的函数都是单元的(接受一个参数)
- 执行顺序自右向左
- 所有函数的执行都是同步的

```js
const init = (...args) => args.reduce((acc, cur) => acc + cur, 0);
const step2 = val => val + 2;
const step3 = val => val + 3;
const step4 = val => val + 4;

/**函数队列 */
const steps = [step4, step3, step2, init];

/**组合函数并执行 */
const funcs = compose(...steps);

/**
 * 执行过程
 * 6 => 6 + 2 => 8 + 3 => 11 + 4
 *
 * 所以流程就是从 init 自右到左依次执行
 * 下一个任务的参数是上一个任务的返回结果
 * 并且任务都是同步的
 * 这样就能保证任务可以按照有序的方向和有序的时间执行
 */
console.log(funcs(1, 2, 3));
```

## 五种实现 compose 的思路

1.  [面向过程](./basic/index.js)
2.  [函数组合(reduce)](./reduce/index.js)
3.  [函数交织(AOP 编程)](./aop/index.js)
4.  [Promise(sequence)](./promise/index.js)
5.  [Generator(yield)](./generator/index.js)
