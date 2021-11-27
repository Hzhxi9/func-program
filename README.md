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
showStudent('666')

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

四、 point-free

tacit programming，也被称作为 point-free，point 表示的就是形参，意思大概就是没有形参的编程风格。

```js
/**这就是有参的，因为 word 这个形参*/
var snakeCase = word => word.toLowerCase().replace(/\s+/gi, '_');

/**这是 point-free，没有任何形参*/
var snakeCase = compose(replace(/\s+/gi, '_'), toLowerCase);
```

有参的函数的目的是得到一个数据，而 point-free 的函数的目的是得到另一个函数。

那这 point-free 有什么用？

它可以让我们把注意力集中在函数上，参数命名的麻烦肯定是省了，代码也更简洁优雅。

需要注意的是，一个 point-free 的函数可能是由众多非 point-free 的函数组成的，

也就是说底层的基础函数大都是有参的 point-free 体现在用基础函数组合而成的高级函数上

这些高级函数往往可以作为我们的业务函数，通过组合不同的基础函数构成我们的复制的业务逻辑。

可以说 point-free 使我们的编程看起来更美，更具有声明式，这种风格算是函数式编程里面的一种追求，一种标准，我们可以尽量的写成 point-free，但是不要过度的使用，任何模式的过度使用都是不对的。

五、柯里化

> 柯里化: ，又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

在定义中获取两个比较重要的信息：

- 接收一个单一参数
- 返回结果是函数

这两个要点不是 compose 函数参数的要求么，而且可以将多个参数的函数转换成接受单一参数的函数，岂不是可以解决我们再上面提到的基础函数如果是多个参数不能用的问题，所以这就很清楚了柯里化函数的作用了。

具体例子:

比如你有一间士多店并且你想给你优惠的顾客给个 10% 的折扣（即打九折）：

```js
function discount(price, discount) {
  return price * discount;
}
```

当一位优惠的顾客买了一间价值$500 的物品，你给他打折：

```js
const price = discount(500, 0, 1); // 50
```

你可以预见，从长远来看，我们会发现自己每天都在计算 10% 的折扣：

```js
const price = discount(1500, 0.1); // $150
const price = discount(2000, 0.1); // $200
// ... 等等很多
```

我们可以将 discount 函数柯里化，这样我们就不用总是每次增加这 0.10 的折扣。

```js
/**
 * 这个就是一个柯里化函数，将本来两个参数的 discount ，
 * 转化为每次接收单个参数完成求
 **/
function discountCurry(discount) {
  return price => price * discount;
}
const tenPercentDiscount = discountCurry(0.1);
```

现在，我们可以只计算你的顾客买的物品都价格了：

```js
tenPercentDiscount(500); // $50
```

同样地，有些优惠顾客比一些优惠顾客更重要-让我们称之为超级客户。
并且我们想给这些超级客户提供 20% 的折扣。 可以使用我们的柯里化的 discount 函数：

```js
const twentyPercentDiscount = discountCurry(0.2);
```

我们通过这个柯里化的 discount 函数折扣调为 0.2（即 20%），给我们的超级客户配置了一个新的函数。

返回的函数 twentyPercentDiscount 将用于计算我们的超级客户的折扣：

```js
twentyPercentDiscount(500); // 100
```

柯里化在函数式编程里面的应用

现在我们有这么一个需求：给定的一个字符串，先翻转，然后转大写，找是否有 TAOWENG，如果有那么就输出 yes，否则就输出 no。

```js
function stringToUpper(str) {
  return str.toUpperCase();
}
function stringReverse(str) {
  return str.split('').reverse().join('');
}
function find(str, targetStr) {
  return str.includes(targetStr);
}
function judge(is) {
  console.log(is ? 'yes' : 'no');
}
```

我们很容易就写出了这四个函数，前面两个是上面就已经写过的，然后 find 函数也很简单，现在我们想通过 compose 的方式来实现 point-free，但是我们的 find 函数要接受两个参数，不符合 compose 参数的规定，这个时候我们像前面一个例子一样，把 find 函数柯里化一下，然后再进行组合：

```js
/**柯里化 find 函数*/
function findCurry(targetStr) {
  return str => str.includes(targetStr);
}
const findTaoweng = findCurry('TAOWENG');
const result = compose(judge, findTaoweng, stringReverse, stringToUpper);
```

看到这里是不是可以看到柯里化在达到 pointfree 是非常的有用，较少参数，一步一步的实现我们的组合。

但是通过上面那种方式柯里化需要去修改以前封装好的函数，这也是破坏了开闭原则，而且对于一些基础函数去把源码修改了，其他地方用了可能就会有问题，所以我们应该写一个函数来手动柯里化。

根据定义之前对柯里化的定义，以及前面两个柯里化函数，我们可以写一个二元(参数个数为 2)的通用柯里化函数：

```js
function twoCurry(fn) {
  // 第一次调用获得第一个参数
  return function (firstArg) {
    // 第二次调用获得第二个参数
    return function (secondArg) {
      // 将两个参数应用到函数 fn 上
      return fn(firstArg, secondArg);
    };
  };
}
```

所以上面的 findCurry 就可以通过 twoCurry 来得到：

```js
const findCurry = twoCurry(find);
```

这样我们就可以不更改封装好的函数，也可以使用柯里化，然后进行函数组合。不过我们这里只实现了二元函数的柯里化，要是三元，四元是不是我们又要要写三元柯里化函数，四元柯里化函数呢，其实我们可以写一个通用的 n 元柯里化。

```js
function currying(fn, ...args) {
  if (args.length >= fn.length) {
    return fn(...args);
  }
  return function (...args2) {
    return currying(fn, ...args, ...args2);
  };
}
```

我这里采用的是递归的思路，当获取的参`数个数大于或者等于 fn 的参数个数的时候，就证明参数已经获取完毕，所以直接执行 fn 了，如果没有获取完，就继续递归获取参数。

可以看到其实一个通用的柯里化函数核心思想是非常的简单，代码也非常简洁，而且还支持在一次调用的时候可以传多个参数(但是这种传递多个参数跟柯里化的定义不是很合，所以可以作为一种柯里化的变种)。

> 我这里重点不是讲柯里化的实现，所以没有写得很健壮，更强大的柯里化函数可见羽讶的：[JavaScript 专题之函数柯里化](https://segmentfault.com/a/1190000010608477)。

六、部分应用

部分应用是一种通过将函数的不可变参数子集，初始化为固定值来创建更小元数函数的操作。简单来说，如果存在一个具有五个参数的函数，给出三个参数后，就会得到一个、两个参数的函数。

看到上面的定义可能你会觉得这跟柯里化很相似，都是用来缩短函数参数的长度，所以如果理解了柯里化，理解部分应用是非常的简单：

```js
function debug(type, firstArg, secondArg) {
  if (type === 'log') console.log(firstArg, secondArg);
  else if (type === 'info') console.log(firstArg, secondArg);
  else if (type === 'warn') console.log(firstArg, secondArg);
  else console.log(firstArg, secondArg);
}
const logDebug = 部分应用(debug, 'log');
const infoDebug = 部分应用(debug, 'info');
const warnDebug = 部分应用(debug, 'warn');
const errDebug = 部分应用(debug, 'error');

logDebug('log:', '测试部分应用');
infoDebug('info:', '测试部分应用');
warnDebug('warn:', '测试部分应用');
errDebug('error:', '测试部分应用');
```

debug 方法封装了我们平时用 console 对象调试的时候各种方法，本来是要传三个参数，我们通过部分应用的封装之后，我们只需要根据需要调用不同的方法，传必须的参数就可以了。

我这个例子可能你会觉得没必要这么封装，根本没有减少什么工作量，但是如果我们在 debug 的时候不仅是要打印到控制台，还要把调试信息保存到数据库，或者做点其他的，那是不是这个封装就有用了。

因为部分应用也可以减少参数，所以他在我们进行编写组合函数的时候也占有一席之地，而且可以更快传递需要的参数，留下为了 compose 传递的参数，这里是跟柯里化比较，因为柯里化按照定义的话，一次函数调用只能传一个参数，如果有四五个参数就需要:

```js
function add(a, b, c, d) {
  return a + b + c + d;
}

// 使用柯里化方式来使 add 转化为一个一元函数
let addPreThreeCurry = currying(add)(1)(2)(3);
addPreThree(4); // 10
```

这种连续调用(这里所说的柯里化是按照定义的柯里化，而不是我们写的柯里化变种)，但是用部分应用就可以:

```js
// 使用部分应用的方式使 add 转化为一个一元函数
const addPreThreePartial = 部分应用(add, 1, 2, 3);
addPreThree(4); // 10
```

既然我们现在已经明白了部分应用这个函数的作用了，那么还是来实现一个吧，真的是非常的简单：

```js
// 通用的部分应用函数的核心实现
function partial(fn, ...args) {
  return (..._arg) => {
    return fn(...args, ..._arg);
  };
}
```

另外不知道你有没有发现，这个部分应用跟 JavaScript 里面的 bind 函数很相似，都是把第一次穿进去的参数通过闭包存在函数里，等到再次调用的时候再把另外的参数传给函数，只是部分应用不用指定 this，所以也可以用 bind 来实现一个部分应用函数。

```js
// 通用的部分应用函数的核心实现
function partial(fn, ...args) {
  return fn.bind(null, ...args);
}
```

另外可以看到实际上柯里化和部分应用确实很相似，所以这两种技术很容易被混淆。它们主要的区别在于参数传递的内部机制与控制：

- 柯里化在每次分布调用时都会生成嵌套的一元函数。在底层 ，函数的最终结果是由这些一元函数逐步组合产生的。同时，curry 的变体允许同时传递一部分参数。因此，可以完全控制函数求值的时间与方式。
- 部分应用将函数的参数与一些预设值绑定(赋值)，从而产生一个拥有更少参数的新函数。改函数的闭包中包含了这些已赋值的参数，在之后的调用中被完全求值。
