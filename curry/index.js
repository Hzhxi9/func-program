/**
 * 柯里化函数的定义
 *
 * 在数学和计算机科学中，
 * 柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。
 */

function add(a, b) {
  return a + b;
}
// 执行add函数, 一次传入两个参数即可
add(1, 2); // 3

// 假设有一个 curry 函数可以做到柯里化
var addCurry = curry(add);
addCurry(1)(2); // 3

/**
 * 用途： 参数复用。本质上是降低通用性，提高适用性。
 */

// 例子
function ajax(type, url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open(type, url, true);
  xhr.send(data);
}
// 虽然 ajax 这个函数非常通用，但在重复调用的时候参数冗余
ajax('POST', 'www.test.com', 'name=kevin');
ajax('POST', 'www.test2.com', 'name=kevin');
ajax('POST', 'www.test3.com', 'name=kevin');

// 利用curry
var ajaxCurry = curry(ajax);

// 以 POST 类型请求数据
var post = ajaxCurry('POST');
post('www.test.com', 'name=kevin');

//  以 POST 类型请求来自于 www.test.com 的数据
var postFromTest = post('www.test.com');
postFromTest('name=kevin');

/**把柯里化后的函数传给其他函数 */

var person = [{ name: 'kevin' }, { name: 'daisy' }];

/**获取所有的 name 值 */
var name = person.map(item => item.name);

/**有 curry 函数 */
const prop = curry((key, value) => value[key]);

/**person 对象遍历(map)获取(prop) name 属性 */
const name = person.map(prop('name'))
