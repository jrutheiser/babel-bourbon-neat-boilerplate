import $ from 'jquery';
import utils from './utils';

const A = 999;
let x = 9;
let b = `testing one two three ${A} ${x}`;

utils.log(b);

for (let x = 0; x < 100; x++) {
  utils.log(x);
}

for (let x = 0; x < 100; x++) {
  utils.log(x);
}


[0, 1, 2].forEach(item => {
  utils.log(item);
});

if ($('h1').length) {
  utils.log('there is a h1!');
  utils.log('asdfasdfasdf');
}
