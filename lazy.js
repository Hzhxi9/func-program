/**
 * 惰性函数:
 *   函数执行的分支只会在函数第一次调用的时候执行
 *   在第一次调用过程中，该函数会被覆盖为另一个按照合适方式执行的函数
 *   这样任何对原函数的调用就不用再经过执行的分支了
 *
 * 本质:
 *   函数重写
 *   所谓惰性载入，指函数执行的分支只会发生一次
 *
 * 那什么时函数重写呢？
 *   由于一个函数可以返回另一个函数，因此可以用新的函数在覆盖旧的函数。
 */

function a() {
  console.log('a');
  a = function () {
    console.log('b');
  };
}

/**
 * 分析: 第一次调用函数时, console.log('a')会被执行, 打印出a
 * 全局变量a 被重定义被赋予了新的函数, 当再一次调用时, console.log('b')被执行
 */
a(); /**a */
a(); /**b */

/**
 * 用处：因为各浏览器之间的行为差异，经常会在函数中包含了大量的if语句，以检查浏览器特性，解决不同浏览器的兼容问题。
 *
 * 每次调用emit函数的时候，它都要对浏览器所支持的能力进行检查，
 *  1. 要对浏览器所支持的能力进行检查
 *  2. 如果不支持，再检查是否支持attachEvent方法
 *  3. 如果还不支持，就用dom0级的方法添加事件
 *
 * 这个过程，在addEvent函数每次调用的时候都要走一遍
 * 其实，如果浏览器支持其中的一种方法，那么它就会一直支持了，就没有必要再进行其他分支的检测了。
 * 也就是说，if语句不必每次都执行，代码可以运行的更快一些。
 **/

/**
 * @param {*} element
 * @param {*} type
 * @param {*} func
 */
function emit(element, type, func) {
  if (element.addEventListener) element.addEventListener(type, func, false);
  else if (element.attachEvent) element.attachEvent('on' + type, func);
  else element['on' + type] = func; /**如果不支持DOM 2级别事件 */
}

/**
 * 1. 在函数被调用时，再处理函数。
 *    函数在第一次调用时，该函数会被覆盖为另外一个按合适方式执行的函数
 *    这样任何对原函数的调用都不用再经过执行的分支了
 *
 * 在第一次给div进行fn1事件绑定时，已经知道浏览器可以执行哪种绑定方式
 * 执行绑定fn2时，就没有必要再次进行判断
 * 那么代码可以进行修改：
 *
 * 我们在进行第一次判断后，对函数进行重新定义，这样在之后再进行绑定时不需要再进行判断，
 * 从性能角度讲，虽然创建了闭包，但优于后续进行多次同一个的判断。
 *
 * 总结: 函数的惰性思想，对于同一个判断，我们只需要进行一次就好。
 */
function emit(element, type, func) {
  /**
   * if语句的每个分支都会为emit变量赋值，有效覆盖了原函数。最后一步便是调用了新赋函数。
   */

  if (element.addEventListener) {
    emit = function (element, type, func) {
      element.addEventListener(type, func, false);
    };
  } else if (element.attachEvent) {
    emit = function (element, type, func) {
      element.attachEvent('on' + type, func);
    };
  } else {
    /**如果不支持DOM 2级别事件 */
    emit = function (element, type, func) {
      element['on' + type] = func;
    };
  }
  /**
   * 下一次调用emit时，便会直接调用新赋值的函数，这样就不用再执行if语句了。
   */
  return emit(element, type, func);
}

/**
 * 2. 声明函数时就指定适当的函数
 */
const emit = (function () {
  if (document.addEventListener) {
    return function (element, type, func) {
      element.addEventListener(type, func, false);
    };
  } else if (document.attachEvent) {
    return function (element, type, func) {
      element.attachEvent('on' + type, func);
    };
  } else {
    return function (element, type, func) {
      element['on' + type] = func;
    };
  }
})();
