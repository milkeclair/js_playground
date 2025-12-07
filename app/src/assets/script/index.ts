import { digNestedKeys } from './dig_nested_keys';
import { camelize } from './camelize';
import { hasAnyKey } from './has_any_key';

const obj = {
  a: {
    b: {
      c: 'd',
    },
  },
};

console.log(digNestedKeys(['a', 'b', 'c'], obj)); // => "d"
console.log(camelize('hello_world', { lowerFirst: false })); // => "HelloWorld"
console.log(hasAnyKey(obj)); // => true
