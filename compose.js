/**
 * 什么是compose
 *
 * compose就是执行一系列的任务（函数）
 *    例如有以下任务队列: const task = [step1, step2, step3, step4]
 *    每个step都是一个步骤, 按照步骤一步步地执行到结尾, 这就是一个compose
 *
 * 实现compose有三点说明
 *    - 第一个函数是多元的(接受多个参数), 后面的函数都是单元的(接受一个参数)
 *    - 执行顺序自右向左
 *    - 所有函数的执行都是同步的
 */
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

/**
 * 五种实现compose的思路
 *
 * 1. 面向过程
 * 2. 函数组合(reduce)
 * 3. 函数交织(AOP 编程)
 * 4. Promise(sequence)
 * 5. Generator(yield)
 */

/**
 * 面向过程
 *
 * 思路:
 *  使用递归的过程思想, 不断的检测队列中是否还有任务
 *  如果有任务就执行，并把执行结果往后传递，这里是一个局部的思维，无法预知任务何时结束。
 *  直观上最容易结束和理解
 **/
function composeOfBasic(...args) {
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
const composeOfReduce = (...args) => args.reverse().reduce(_pipe, args.shift());

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
    return fn.apply(null, result);
  };
};

/**
 * 这里对函数进行方法的绑定
 * 返回的是带着函数执行的规则的另外一个函数
 * 在这里是次序的排列规则，对返回的函数依然可以进行链式调用
 */
const composeOfAOP = function (...args) {
  const before = args.pop();
  const start = args.pop();
  if (args.length) {
    return args.reduce(function (f1, f2) {
      return f1.after(f2);
    }, start.before(before));
  }
  return start.before(before);
};

/**
 * Promise
 *
 * ES6引入了Promise
 * Promise可以指定一个sequence，来规定一个执行then的过程
 * then函数会等到执行完成后，再执行下一个then的处理
 * 启动sequence可以使用Promise.resolve()这个函数
 * 构建sequence可以使用reduce compose实现
 */
const composeOfPromise = function (...args) {
  const init = args.pop();
  return function (...arg) {
    return args.reverse().reduce(function (sequence, func) {
      return sequence.then(function (result) {
        return func.call(null, result);
      });
    }, Promise.resolve(init.apply(null, arg)));
  };
};

/**
 * Generator
 *
 * Generator主要使用yield来构建协程，采用中断，处理，再中断的流程。
 * 可以事先规定好协程的执行顺序，然后再下次处理的时候进行参数（结果）交接
 *
 * 有一点要注意的是，由于执行的第一个next是不能传递参数的，
 * 所以第一个函数的执行需要手动调用
 * 再空耗一个next，
 * 后面的就可以同步执行了。
 */

/**generator 构建 */
function* iterateSteps(steps) {
  let n;
  for (let i = 0, len = steps.length; i < len; i++) {
    if (n) n = yield steps[i].call(null, n);
    else n = yield;
  }
}

/**compose 实现 */
function composeOfGenerator(...steps) {
  const g = iterateSteps(steps);
  return function (...args) {
    /**第一个值 */
    const val = steps.pop().apply(null, args);
    /**因为无法传参数 所以无所谓执行 就是空耗一个yield */
    g.next();
    return steps.reverse().reduce((val, val1) => g.next(val).value, val);
  };
}

/**bad */

const fn1 = x => x + 10;
const fn2 = x => x * 10;
const fn3 = x => x / 10;

console.log(fn3(fn1(fn2(fn1(6)))));

/**
 * 拆分出来
 * 即把前一个函数的运行结果赋值给后一个函数
 */
let x = fn1(6);
x = fn2(x);
x = fn1(x);
x = fn3(x);

console.log(x);

/**
 * 用一个函数解决问题 => compose(fn1, fn2, fn1, fn3)(6)
 * 函数调用的扁平化，即把层级嵌套的那种函数调用(一个函数的运行结果当作实参传给下一个函数的这种操作)扁平化
 * @param  {...any} funcs 传递函数集合
 */
function compose(...funcs) {
  /**
   * compose函数执行后跟个()，说明函数执行完再执行一个函数
   * 即函数执行完会返回一个新函数，而且也会给出第一次调用函数时的参数
   * @param {...any} 第一次调用函数传递的参数集合
   */
  return function proxy(...args) {
    const len = funcs.length;
    /**没有传入函数, 不需要执行直接返回args */
    if (len === 0) return args;
    /**传一个函数, 需把后一个的参数赋给这个函数, 把函数执行, 把其结果返回即可 */
    if (len === 1) return funcs[0](...args);
    /**传两个函数以上, 那就是把前一个函数的执行结果赋给后一个函数 */
    return funcs.reduce((x, y) => {
      /**需要注意: 第一次执行, 参数x是一个函数, 之后再执行的时候x是函数执行的结果 */
      return typeof x === 'function' ? y(x(...args)) : y(x);
    });
  };
}
console.log(compose(fn1, fn2, fn1, fn3)(6));

/**
 * redux源码中的compos
 * 它执行的顺序是函数集合中的函数从后往前执行
 */
function redux_compose(...funcs) {
  const len = funcs.length;
  if (len === 0) return args => args;
  if (len === 1) return funcs[0];
  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}
console.log(redux_compose(fn3, fn1, fn2, fn1)(6));
