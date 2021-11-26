/**
 * 需求1: 通过 id 找到学生的记录并渲染在浏览器
 */
const ids = [
  { name: '小明', id: 1 },
  { name: '小红', id: 2 },
  { name: '小张', id: 3 },
];

/**命令式 实现 */
function showStudent(id) {
  const stuId = ids.find(value => id === value.id);
  if (stuId !== null) console.log('finding this id is' + stuId);
  else throw new Error('not found');
}
showStudent(3);

/**函数式 实现 */

/**通过 find 函数找到 学生 */
const find = curry(function (list, id) {
  const student = list.find(value => value.id === id);
  if (!student) throw new Error('not found');
  return student;
});

/**将 学生对象 format */
const format = student => `finding this student is ${student.name}`;

/**在屏幕上显示 */
const append = curry(function (info) {
  console.log(info);
});

/**组合 函数 */
const show = compose(append, format, find(ids));

/**调用 */
show(2);

/**
 * 需求2: 给你一个字符串，将这个字符串转化成大写，然后逆序。
 */
const str = 'function program';

/**实现一: 一行代码搞定 */
const oneLine = str => str.toUpperCase().split('').reverse().join('');

/**实现二: 多行代码处理 */
function multiLine(str) {
  /**先转成大写 */
  const upperStr = str.toUpperCase();
  /**逆序 */
  return upperStr.split('').reverse().join('');
}

/**实现三: 用函数式编程的方式 */

/**大写 */
const strToUpper = str => str.toUpperCase();

/**逆序 */
const strToReverse = str => str.split('').reverse().join('');

/**转数组 */
const strToArray = str => str.split('');

/**组合辅助 */
const compose = function (...funcs) {
  return function (...args) {
    const len = args.length;
    if (len === 0) return args;
    if (len === 1) return funcs[0](...args);
    return funcs.reduce((acc, cur) => {
      return typeof x === 'function'? cur(acc(...args)): cur(acc)
    })
  };
};

/**组合 */
const toUpperAndReverse = compose(strToReverse, strToUpper);

/**调用 */
const res = toUpperAndReverse(str);

console.log(res, '==res==')
