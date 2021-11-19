# 函数式编程

一、 什么是函数式编程

- 函数式编程是一种强调以函数使用为主的软件开发风格。
- 函数式编程的目的是使用函数来抽象作用在数据之上的控制流和操作，从而在系统中消除副作用并减少对状态的改变。

1. 程序分解

其实我们是讲程序分解为一些更可重用、更可靠且更易于理解的部分，然后再将他们组合起来，形成一个更易推理的程序整体，这是我们前面谈到的基本原则。

可以看到我们是将一个任务拆分成多个最小颗粒的函数，然后通过组合的方式来完成我们的任务，这跟我们组件化的思想很类似，将整个页面拆分成若干个组件，然后拼装起来完成我们的整个页面。

在函数式编程里面，组合是一个非常非常非常重要的思想。

2. 基本概念

- 声明式编程

函数式编程属于声明是编程范式：这种范式会描述一系列的操作，但并不会暴露它们是如何实现的或是数据流如何传过它们。

我们所熟知的 SQL 语句就是一种很典型的声明式编程，它由一个个描述查询结果应该是什么样的断言组成，对数据检索的内部机制进行了抽象。

对比命令式编程和声明式编程

```js
/**命令式*/
var array = [0, 1, 2, 3];
for (let i = 0, len = array.length; i < len; i++) array[i] = Math.pow(array[i], 2);
console.log(array);

/**声明式*/
[0, 1, 2, 3].map(num => Math.pow(num, 2));
```

可以看到命令式很具体的告诉计算机如何执行某个任务。

而声明式是将程序的描述与求值分离开来。它关注如何用各种表达式来描述程序逻辑，而不一定要指明其控制流或状态关系的变化。

为什么我们要去掉代码循环呢？

循环是一种重要的命令控制结构，但很难重用，并且很难插入其他操作中。而函数式编程旨在尽可能的提高代码的无状态性和不变性。

要做到这一点，就要学会使用无副作用的函数--也称纯函数

- 纯函数

纯函数指没有副作用的函数。相同的输入有相同的输出，就跟我们上学的函数一样。

常常这些情况会产生副作用。

- 改变一个全局的变量、属性或数据结构
- 改变一个函数参数的原始值
- 处理用户输入
- 抛出一个异常
- 屏幕打印或记录日志
- 查询 HTML 文档，浏览器的 Cookie 或访问数据库

举一个简单的例子

```js
var counter = 0;
function increment() {
  return ++counter;
}
```

这个函数就是不纯的，它读取了外部的变量，可能会觉得这段代码没有什么问题，但是我们要知道这种依赖外部变量来进行的计算，计算结果很难预测，你也有可能在其他地方修改了 counter 的值，导致你 increment 出来的值不是你预期的。

对于纯函数有以下性质：

- 仅取决于提供的输入，而不依赖于任何在函数求值或调用间隔时可能变化的隐藏状态和外部状态。
- 不会造成超出作用域的变化，例如修改全局变量或引用传递的参数。

但是在我们平时的开发中，有一些副作用是难以避免的，与外部的存储系统或 DOM 交互等，但是我们可以通过将其从主逻辑中分离出来，使他们易于管理。

现在我们有一个小需求：通过 id 找到学生的记录并渲染在浏览器(在写程序的时候要想到可能也会写到控制台，数据库或者文件，所以要想如何让自己的代码能重用)中。

```js
/**命令式*/
function showStudent(id) {
  /**这里假如是同步查询*/
  var student = db.get(id);
  if (student !== null) {
    /**读取外部的 elementId*/
    document.querySelector(`${elementId}`).innerHTML = `${student.id},${student.name},${student.lastname}`;
  } else {
    throw new Error('not fount');
  }
}
showStudent('666)

/**函数式*/

/**通过 find 函数找到学生*/
var find = curry(function(db, id){
    var obj = db.get(id)
    if(obj === null) throw new Error('not found')
    return obj
})
/**将学生对象 format*/
var csv = student => `${student.id},${student.name},${student.lastname}`
/**在屏幕上显示*/
var append = curry(function(elementID, info){
    document.querySelector(elementId).innerHTML = info
})
var showStudent = compose(append('#student-info'), csv, find(db))
showStudent('666')
```

可以看到函数式代码通过较少这些函数的长度，将 showStudent 编写为小函数的组合

- 灵活。有三个可重用的组件
- 声明式的风格，给高阶步骤提供了一个清晰视图，增强了代码的可读性
- 另外是将纯函数与不纯的行为分离出来。

我们看到纯函数的输出结果是一致的，可预测的，相同的输入会有相同的返回值，这个其实也被称为引用透明。

- 引用透明

引用透明是定义一个纯函数较为正确的方法。

纯度在这个意义上表示一个函数的参数和返回值之间映射的纯的关系。

如果一个函数对于相同的输入始终产生相同的结果，那么我们就说它是引用透明。

```js
/**非引用透明*/
var counter = 0;
function increment() {
  return ++counter;
}
/**引用透明*/
var increment = counter => counter + 1;
```

- 不可变性

不可变数据是指那些创建后不能更改的数据。与许多其他语言一样，JavaScript 里有一些基本类型(String,Number 等)从本质上是不可变的，但是对象就是在任意的地方可变。

```js
var sort = function (arr) {
  return arr.sort(function (a, b) {
    return a - b;
  });
};

var arr = [1, 3, 2];
sortDesc(arr); // [1, 2, 3]
arr; // [1, 2, 3]
```

这段代码看似没什么问题，但是会导致在排序的过程中会产生副作用，修改了原始引用，可以看到原始的 arr 变成了 [1, 2, 3]。

二、总结

1. 使用纯函数的代码绝不会更改或破坏全局状态，有助于提高代码的可测试性和可维护性
2. 函数式编程采用声明式的风格，易于推理，提高代码的可读性。
3. 函数式编程将函数视为积木，通过一等高阶函数来提高代码的模块化和可重用性。
4. 可以利用响应式编程组合各个函数来降低事件驱动程序的复杂性。

三、组合函数

组合是一种为软件的行为，进行清晰建模的一种简单、优雅而富于表现力的方式。
通过组合小的、确定性的函数，来创建更大的软件组件和功能的过程，会生成更容易组织、理解、调试、扩展、测试和维护的软件。

比如我们现在流行的 SPA (单页面应用)，都会有组件的概念。

为什么要有组件的概念呢？

因为它的目的就是想让你把一些通用的功能或者元素组合抽象成可重用的组件，就算不通用，你在构建一个复杂页面的时候也可以拆分成一个个具有简单功能的组件，然后再组合成你满足各种需求的页面。

其实我们函数式编程里面的组合也是类似，函数组合就是一种将已被分解的简单任务组织成复杂的整体过程。

现在我们有这样一个需求：给你一个字符串，将这个字符串转化成大写，然后逆序。

```js
var str = 'function program';

/**一行代码搞定*/
function oneLine(str) {
  return str.toUpperCase().split('').reverse().join('');
}

/** 或者按要求一步一步来，先转成大写，然后逆序*/
function multiLine(str) {
  var upperStr = str.toUpperCase();
  var res = upperStr.split('').reverse().join('');
  return res;
}

console.log(oneLine(str)); // MARGORP NOITCNUF
console.log(multiLine(str)); // MARGORP NOITCNUF
```

用函数式编程的方式来写

那么我们如果把最开始的需求代码写成这个样子，以函数式编程的方式来写。

```js
var str = 'function program';

function stringToUpper(str) {
  return str.toUpperCase();
}

function stringReverse(str) {
  return str.split('').reverse().join('');
}

var toUpperAndReverse = 组合(stringReverse, stringToUpper);
var res = toUpperAndReverse(str);
```

那么当我们需求变化的时候，我们根本不需要修改之前封装过的东西。

```js
// 把字符串大写之后，把每个字符拆开之后组装成一个数组，比如 ’aaa‘ 最终会变成 [A, A, A]。
var str = 'function program';

function stringToUpper(str) {
  return str.toUpperCase();
}

function stringReverse(str) {
  return str.split('').reverse().join('');
}

function stringToArray(str) {
  return str.split('');
}

var toUpperAndArray = 组合(stringToArray, stringToUpper);
toUpperAndArray(str);
```

把字符串大写之后，再翻转，再转成数组

```js
var str = 'function program';

function stringToUpper(str) {
  return str.toUpperCase();
}

function stringReverse(str) {
  return str.split('').reverse().join('');
}

function stringToArray(str) {
  return str.split('');
}

var strUpperAndReverseAndArray = 组合(stringToArray, stringReverse, stringToUpper);
strUpperAndReverseAndArray(str);
```

发现并没有更换你之前封装的代码，只是更换了函数的组合方式。

可以看到，组合的方式是真的就是抽象单一功能的函数，然后再组成复杂功能。这种方式既锻炼了你的抽象能力，也给维护带来巨大的方便。

首先我们可以知道，这是一个函数，同时参数也是函数，返回值也是函数。

怎么将两个函数进行组合呢？

根据上面说的，参数和返回值都是函数，那么我们可以确定函数的基本结构如下(顺便把组合换成英文的 compose)。

```js
/**将两个函数合成*/
function twoFunctionCompose(fn1, fn2) {
  return function (arg) {
    return fn1(fn2(arg));
  };
}

/**多个函数的情况*/
function compose(...args) {
  return result =>
    reduceRight((result, fn) => {
      return fn(result);
    }, result);
}
```

实现 compose 的方式很多, 可以参考[实现 compose 的五种思路](https://segmentfault.com/a/1190000011447164)

> 注意：要传给 compose 函数是有规范的，首先函数的执行是从最后一个参数开始执行，一直执行到第一个，而且对于传给 compose 作为参数的函数也是有要求的，必须只有一个形参，而且函数的返回值是下一个函数的实参。

对于 compose 从最后一个函数开始求值的方式如果你不是很适应的话，你可以通过 pipe 函数来从左到右的方式。

实现跟 compose 差不多，只是把参数的遍历方式从右到左(reduceRight)改为从左到右(reduce)。

```js
function pipe(...args) {
  return result => {
    return args.reduce((result, fn) => {
      return fn(result);
    }, result);
  };
}
```
