const compose = require('./index');

const init = (...args) => args.reduce((acc, cur) => acc + cur, 0);
const step2 = val => val + 2;
const step3 = val => val + 3;
const step4 = val => val + 4;

const steps = [step4, step3, step2, init];

const fn = compose(...steps);

fn(1, 2, 3).then(data => console.log(data))
