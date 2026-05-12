# Next-generation JavaScript & TypeScript

### "let" and "const"

`let` is "blocked scoped" `{}`!

```ts
const aName = 'Max'; // it is a const – immutable
console.log(name);
aName = 'Antoine'; // KO, we can't update the value

let age = 30; // we can modify the value
age = 29;

// BUT let is block scoped compared to var

if (age > 20) {
  var isOldWithVar = true;
}

console.log(isOldWithVar); // it works, because var is global in this file

if (age > 20) {
  let isOldWithLet = true;
}

console.log(isOldWithLet); // it won't work
```

---

### Arrow Functions

```ts
const add = (a: number, b: number) => {
  return a + b;
};

// When you have only 1 expression, you can remove the curly brace and the return statement

const addShort = (a: number, b: number) => a + b;

// When you have only 1 parameter, you can

const printOutput: (a: number | string) => void = (output) =>
  console.log(output);

printOutput(add(5, 2));
```

---

### Default Functions Parameters

The default arguments should be the last ones.

```ts
// default value added
const add = (a: number, b: number = 1) => a + b;

const printOutput: (a: number | string) => void = (output) =>
  console.log(output);

printOutput(add(5));
```

---

### The Spread Operator (...)

```ts
const hobbies = ['Sports', 'Cooking'];
const activeHobbies = ['Hiking'];
activeHobbies.push(...hobbies);
// const activeHobbies = ['Hiking', ...hobbies];

const person = {
  name: 'Max',
  age: 30,
};

// We're copying the pointer/reference of the person object in memory to this copiedPerson constant
const copiedPersonReference = person;

// Shallow copy — top-level fields are copied, but nested objects/arrays still share references
// with the original. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
const copiedPersonShallow = { ...person };

// For an actual deep copy, use structuredClone() (Node 17+, all modern browsers)
const copiedPersonDeep = structuredClone(person);
```

---

### Rest Parameters

```js
const add = (...numbers: number[]) => {
  return numbers.reduce((acc, num) => acc + num, 0);
};

const addedNumbers = add(1, 3, 10, 5.5, 3.7);
console.log(addedNumbers);
```

Note: `push` is working in the same way with the rest parameter.

```ts
// You can also type the rest parameter as a fixed-length tuple
const add = (...numbers: [number, number, number]) => {
  return numbers.reduce((acc, num) => acc + num, 0);
};

// Or as a variadic tuple (TS 4.0+) — first param typed separately, rest are numbers
const addLabeled = (first: number, ...rest: [number, ...number[]]) => {
  return rest.reduce((acc, num) => acc + num, first);
};
```

---

### Array & Object Destructuring

```ts
const hobbies = ['Sport', 'Cooking'];

// const hobby1 = hobbies[0];
// const hobby2 = hobbies[1];

const [hobby1, hobby2, ...remainingHobbies] = hobbies; // doesn't mutate your original array

const person = {
  firstName: 'Max',
  age: 30,
};

const { firstName: userName, age } = person;

console.log(userName, age);
```
