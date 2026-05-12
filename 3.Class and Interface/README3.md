# Classes & Interfaces

### Useful Resources & Links

- [More on (JS) Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [TS Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

### What are Classes?

What's Object-oriented Programming (OOP)?

Working with "real-life" entities in your code.

Objects >< Classes

**Objects** are the concrete things we work with in our code. The data structure we use to store data, to store methods and to execute methods on. Class-based creation is an alternative to using object literals!

**Classes** are blueprints for Objects. Classes allow us to define _how objects should look like_ (which properties and methods they have) => it is easy to build an Object based on its Class (**Instance** of Class). We can quickly replicate the same object/structure/methods based on the same Classes.

---

### Creating a First Class

```ts
class Department {
  name: string; // field of a class

  // method = function inside a class
  /**
   * A function tied to this object/to this class which is executed
   * when the object is created
   */
  constructor(n: string) {
    // property
    this.name = n;
  }
}

const accounting = new Department('accounting');
console.log(accounting);

// RESULT: JS Object
// Department {name: "accounting"}
// name: "accounting"
// __proto__: Object
```

---

### Compiling to JavaScript

es5:

```ts
'use strict';
var Department = (function () {
  function Department(n) {
    this.name = n;
  }
  return Department;
})();
var accounting = new Department('accounting');
console.log(accounting);
```

---

### Constructor Functions & The "this" Keyword

```ts
class Department {
  name: string;

  constructor(n: string) {
    this.name = n;
  }

  describe() {
    console.log('Departement: ' + this.name);
  }
}

const accounting = new Department('accounting');
accounting.describe();
```

`this` can be tricky:

```ts
const accounting = new Department('accounting');
accounting.describe(); // Departement: accounting
const accountingCopy = { describe: accounting.describe };
accountingCopy.describe(); // Departement: undefined
```

We could prevent it by adding `this: Department` to the `describe` method.

```ts
// adding this: Department to the describe method
describe(this: Department) {
  console.log('Departement: ' + this.name);
}
```

Then `accountingCopy` will get a TS error.

```ts
// ...
const accountingCopy = { describe: accounting.describe };
accountingCopy.describe();
// The 'this' context of type '{ describe: (this: Department) => void; }' is not assignable to method's 'this' of type 'Department'.
// Property 'name' is missing in type '{ describe: (this: Department) => void; }' but required in type 'Department'.
```

The solution here, add a `name` property to `accountingCopy`.

```ts
const accountingCopy = { name: 'Whatever', describe: accounting.describe };
accountingCopy.describe();
```

---

### "private" and "public" Access Modifiers

```ts
class Department {
  name: string;
  employees: string[] = [];

  constructor(n: string) {
    this.name = n;
  }

  describe(this: Department) {
    console.log('Departement: ' + this.name);
  }

  addEmployee(employee: string) {
    // + validation here (etc.)
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

const accounting = new Department('accounting');
accounting.addEmployee('Max');
accounting.addEmployee('Manu');
accounting.employees[2] = 'Anna'; // WE DON'T WANT THAT, because we want to use addEmployee (for the validation...)
accounting.describe();
accounting.printEmployeeInformation();
```

You can properties and methods "private" by adding `private` keyword in front of them. The `private` properties will be accessible only iniside the class. As a result `accounting.employees[2] = 'Anna';` won't be possible.

```ts
private employees: string[] = [];
```

By default, properties and methods are `public`. No need to add it `public name: string;`.

---

### Shorthand Initialization

```ts
class Department {
  private id: string;
  private name: string;
  private employees: string[] = [];

  constructor(id: string, n: string) {
    this.id = id;
    this.name = n;
  }
  //...
```

The shortcut is:

```ts
class Department {
  // private id: string;
  // private name: string;
  private employees: string[] = [];

  constructor(private id: string, public name: string) {
    // this.id = id;
    // this.name = n;
  }
  //...
```

```ts
class Department {
  private employees: string[] = [];

  constructor(private id: string, public name: string) {}

  describe(this: Department) {
    console.log(`Departement (${this.id}): ${this.name}`);
  }

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

const accounting = new Department('d1', 'accounting');
accounting.addEmployee('Max');
accounting.addEmployee('Manu');
accounting.describe();
accounting.printEmployeeInformation();
```

---

### "readonly" Properties

If the property won't change (NEVER), add `readonly` to it to enforce it.

```ts
class Department {
  // private readonly id: string;
  // private name: string;
  private employees: string[] = [];

  constructor(private readonly id: string, public name: string) {
    // this.id = id;
    // this.name = n;
  }
  //...
```

---

### QUIZZ

#### Class Basics

##### 1. What's the core idea behind classes?

Classes are blueprints for JavaScript objects. You define how objects (which are instantiated based on classes) should look like.

##### 2. What's a class property?

Basically a variable in a class.

##### 3. What's the idea of the private and public modifiers?

Private marks properties as "not accessible from outside the class". You ensure that a "private" property is only accessible from inside a class (e.g. from inside a class method).

##### 4. How can you shorten the following code in the best possible way?

```ts
class Product {
  title: string;
  price: number;
  private isListed: boolean;

  constructor(name: string, pr: number) {
    this.title = name;
    this.price = pr;
    this.isListed = true;
  }
}
```

**SOLUTION**

```ts
class Product {
  private isListed: boolean;

  constructor(public title: string, public price: number) {
    this.isListed = true;
  }
}
```

---

### Inheritance

We might need more information for a specific type of department...For example, we have an IT dep which has an `id`, a `name` and `employees` but also `administrators` which is something only the IT dep will have. We might have the accounting dep which has an `id`, a `name` and `employees` but also a `report` (also specific only to the accounting dep).

> Note: YOU CAN ONLY INHERIT FROM ONE CLASS.

```ts
class ITDepartment extends Department {
  admins: string[];
  constructor(id: string) {
    super(id, 'IT'); // super is the first to be called before any this
    this.admins = admins;
  }
}
```

```ts
class ITDepartment extends Department {
  constructor(id: string, public admins: string[]) {
    super(id, 'IT');
  }
}

const it = new ITDepartment('d1', ['Max']);
it.addEmployee('Max');
it.describe();
it.printEmployeeInformation();

// RES
// Departement (d1): IT
// 1
// ["Max"]
```

Inheritance in action:

```ts
class ITDepartment extends Department {
  constructor(id: string, public admins: string[]) {
    super(id, 'IT');
  }
}

class AccountingDepartment extends Department {
  constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
  }

  addReport(text: string) {
    this.reports.push(text);
  }

  printReports() {
    console.log(this.reports);
  }
}
```

---

### Overriding Properties & The "protected" Modifier

Let's say we want to override `addEmployee` in `AccountingDepartment` class. We can't access `this.employees` because it is `private` in `Department` class.

```ts
class AccountingDepartment extends Department {
  constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
  }

  addEmployee(name: string) {
    if (name === 'Max') {
      return;
    }

    this.employees.push(name); // KO – Property 'employees' is private and only accessible within class 'Department'.
  }
  //...
```

If we want to access `employees` in class which extends `Department` class we should change `private` with `protected`. As a result, `employees` won't be accessible from outside BUT it can be accessed by the class which extend the "parent" class.

---

### Getters & Setters

A getter:

```ts
class AccountingDepartment extends Department {
  private lastReport: string;

  constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
    this.lastReport = reports[0];
  }

  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }
    throw new Error('No report found.');
  }
  //...

accounting.mostRecentReport // you access it like a property not like you'll call a function
```

A setter:

```ts
  //...
  set mostRecentReport(value: string) {
    if (!value) {
      throw new Error('Please pass in a valid value!');
    }
    this.addReport(value);
  }
  //...

accounting.mostRecentReport = 'Here is the last report...'; // you call it like a property not like you'll call a function
```

---

### Static Methods & Properties

A static property or static method allows you to add properties / methods which are not accessed on an instance of the class. As a result you don't need to call `new` class name first but you can access them directly on the class. Useful for utility functions you want to group or map to a class logically or global const in a class.

`Math` object/class is a good example. It is globally available. `Math.PI` give you the const PI or `Math.pow(2, 2)` give you access to the static method to get the power n of a number. You don't have to call `new Math` (and it won't work).

```ts
class Department {
  static fiscalYear = 2020;
  protected employees: string[] = [];

  constructor(private readonly id: string, public name: string) {}

  static createEmployee(name: string) {
    return { name: name };
  }
  //...

const employee1 = Department.createEmployee('Max');
console.log(employee1, Department.fiscalYear);
```

Note: you you add a `static` property or method, you can't access them from your non static parts.

```ts
  //...
  printEmployeeInformation() {
    console.log(this.employees);
    console.log(this.fiscalYear); // KO – Property 'fiscalYear' is a static member of type 'Department'
    console.log(Department.fiscalYear); // OK
  }
  //...
```

Because `this` does refer to the instance created based on the class. The static property is not available on the instance because the all idea behind `static` property or method is to be detached of the instance. You need to access it via the name of the class: `Department.fiscalYear`.

---

### Abstract Classes

You can easily override a method in a class which `extends` another one.

```ts
class AccountingDepartment extends Department {
  //...
  describe() {
    console.log('Accounting Department – ID: ', this.id); // note: we need to change id to protected in Department
  }
  //...

```

But sometimes you **don't want just to offer the option to override a method**. You instead want to force the dev working on an extending class to implement or to override a certain method.

```ts
abstract class Department {
  //...
  abstract describe(this: Department): void;
```

Note: an `abstract class` cannot be instantiated themselves. It is only useful for the inheriting class (to be forced to implement specific methods).

---

### Singletons & Private Constructors

The singleton pattern restricts the instantiation of a class and ensures that only one instance of the class exists. Singleton pattern restricts the instantiation of a class and ensures that only one instance of the class exists.

For example, we know there is only one accounting dep. We can make the construtor `private` – `private constructor(...)`. It ensures we can't call `new` on the class, so it is only accessible inside the class.

```ts
class AccountingDepartment extends Department {
  private lastReport: string;

  // a private constructor ensures we can't call new on the class
  private constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
    this.lastReport = reports[0];
  }
  //...
```

The solution to get access to a `private` constructor is to use a `static` method.

```ts
class AccountingDepartment extends Department {
  //...
  private static instance: AccountingDepartment; // we create a private static field

  private constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
    //...
  }

  // we create a static method
  static getInstance() {
    if (AccountingDepartment.instance) { // we check if the "instance" exists
      return this.instance; // if yes, we return it
    }
    this.instance = new AccountingDepartment('d2', []); // Otherwise, we call the private constructor, to create the new instance
    return this.instance;
  }
  //...
```

```ts
const accounting1 = AccountingDepartment.getInstance();
const accounting2 = AccountingDepartment.getInstance();
// accounting1 and accounting2 will be the same object / the same instance
```

---

### QUIZZ

#### Classes

##### 1. What's a "static method"?

A method you call directly on a class, not on an object created based on it.

##### 2. What's the idea behind "inheritance"?

Inheritance allows you to share some common functionality and yet create more specialized blueprints. You can set up a base class and then create more specialized classes that inherit from it.

##### 3. What's an abstract class?

A class that can't be instantiated but has to be extended. Abstract classes can't be instantiated.

##### 4. What's the idea behind "singleton classes"?

You only ever have one instance of a singleton class. A singleton class is configured such that you don't create it with "new" but by calling a method which then ensures that only one instance of the class exists at any given time.

---

### Modern Class Features (TS 4.3+ / 4.7+ / 4.9+ / 5.8)

The features below are essentials for new TypeScript code today. Most weren't covered by older course material.

#### ECMAScript `#` private fields vs TS `private`

`#field` is a **JavaScript** feature (ES2022). It is enforced at runtime — accessing `obj.#x` from outside the declaring class is a syntax error at parse time and the field is invisible to `Object.keys`, `for…in`, `JSON.stringify`, and devtools.

```ts
class Counter {
  #count = 0;            // truly private
  bump() { this.#count++; return this.#count; }
}

const c = new Counter();
c.bump();                // ok
// c.#count;             // SyntaxError at parse time

console.log(Object.keys(c));   // []      — # field is non-enumerable
console.log(JSON.stringify(c)); // {}     — not serialized
```

TS `private` is a compile-time check only — at runtime the property is a normal public field.

When to pick which:
- **`#`** when you want true encapsulation, including against people calling your code from plain JS.
- **`private`** when you just want type-system protection and the cleaner syntax.

TS down-levels `#fields` to a WeakMap-based implementation when `target` is below ES2022 (`target >= ES2015` minimum). `target: ES2022+` emits the native syntax.

#### `override` keyword (TS 4.3)

A subclass method that overrides a parent's should declare `override` so renames in the parent immediately produce errors instead of silently breaking the link.

```ts
class Department {
  describe() { console.log('Dept'); }
}

class IT extends Department {
  override describe() { console.log('IT Dept'); }
}
```

Pair with `tsconfig.json`: `"noImplicitOverride": true` to *require* the keyword on every override.

#### `accessor` auto-accessors (TS 4.9)

`accessor name: string` desugars to a `#` private backing field plus a `get`/`set` pair:

```ts
class Person {
  accessor name: string = '';
}

// equivalent to:
class PersonDesugared {
  #name = '';
  get name() { return this.#name; }
  set name(v: string) { this.#name = v; }
}
```

Primarily designed to pair with Stage-3 decorators — a decorator on an `accessor` can replace any of `{ get, set, init }`. See [chapter 6 — Decorators](../6.Decorators/README6.md).

#### Parameter properties + `--erasableSyntaxOnly`

Parameter properties (`constructor(public id: string)` shorthand) are a TS-only feature with no JS equivalent. They are **banned under `--erasableSyntaxOnly`** (TS 5.8) — which is the flag you'd turn on if you want Node's `--experimental-strip-types` to run your code directly.

```ts
class Order {
  // banned under --erasableSyntaxOnly
  constructor(public id: string, public amount: number) {}
}

// erasable equivalent
class OrderErasable {
  id: string;
  amount: number;
  constructor(id: string, amount: number) {
    this.id = id;
    this.amount = amount;
  }
}
```

If you're shipping a library that needs to be erasable, write fields out longhand.

#### `strictPropertyInitialization`

Part of the `strict` family. Class fields must be either initialised or definitely assigned in the constructor; otherwise the compiler errors.

```ts
class User {
  name: string;          // ❌ Property 'name' has no initializer …
  age = 0;               // ✅ has initializer
  email!: string;        // ✅ definite-assignment assertion — "I'll set this later"
  constructor(name: string) { this.name = name; }   // also valid
}
```

The `!` assertion is the right tool when a framework (NestJS, dependency injection, ORM) populates the field outside the constructor.

#### `useDefineForClassFields`

Default `true` when `target >= ES2022` (since TS 4.7). Aligns class field semantics with the ECMAScript spec — fields are installed with `[[Define]]` (like `Object.defineProperty`) instead of `[[Set]]`. The visible difference is when a subclass field shadows a getter/setter in the base — the new semantics make the field win.

Most modern code wants this on. Old decorator/property frameworks (legacy `experimentalDecorators` based) may need `false` for compatibility.

---

### Interface — extra notes

Two facts worth knowing alongside the basics below:

**`implements` doesn't check member visibility.** A class implementing an interface can still mark its own properties `private` — only that class's *implementation* needs them. The interface itself is always describing the public-shape contract.

```ts
interface Identifiable { id: string }

class Token implements Identifiable {
  constructor(private secret: string, public id: string) {}
  // satisfies Identifiable even though `secret` is private
}
```

**Interface declaration merging.** Two `interface X` declarations in the same scope merge into one. This is how you augment ambient types like `Window` or `Express.Request`:

```ts
// global augmentation
declare global {
  interface Window { __MY_APP_VERSION__: string }
}

// module augmentation
declare module 'express-serve-static-core' {
  interface Request { user?: { id: string } }
}
```

Same-named function members become **overloads**; same-named property members must have **compatible types**.

---

### A First Interface

In its simple version, an interface describes the structure (and the the concrete values) of an object. We can use to describe how the object should look like. We don't assign any value to it. We can use it as a type to type check for object which have to get that structure.

```ts
interface Person {
  name: string;
  age: number;

  greet(phrase: string): void;
}

let user1: Person;

user1 = {
  name: 'Max',
  age: 30,
  greet(phrase: string) {
    console.log(`${phrase} from ${this.name}`);
  },
};

console.log(user1);
console.log(user1.greet('Hi there –'));
```

---

### Using Interfaces with Classes

What is the ≠ between `interface` and `type`?

```ts
// INTERFACE
interface Person {
  name: string;
  age: number;

  greet(phrase: string): void;
}

// VS

// TYPE
type Person = {
  name: string;
  age: number;

  greet(phrase: string): void;
};
```

You can implement an interface in a class. An interface can be used as a contract, a class can implement.

```ts
interface Greetable {
  name: string;
  greet(phrase: string): void;
}

class Person implements Greetable {
  name: string;

  constructor(n: string) {
    this.name = n;
  }

  greet(phrase: string) {
    console.log(`${phrase} from ${this.name}`);
  }
}

let user1: Greetable; // OK
user1 = new Person('Max'); // OK
```

> Note: YOU CAN ONLY INHERIT FROM ONE CLASS BUT YOU CAN IMPLEMENT MORE THAN ONE INTERFACE.

An interface is a bit like an abstract class. But the main difference is interface doesn't have any details about the implementation at all. And the abstract class has a mix between how the object should like and implementation as well.

---

### Readonly Interface Properties

You can add `readonly` to a property in an interface. Only be set once and it is readonly after => immutable.

```ts
interface Greetable {
  readonly name: string;
  greet(phrase: string): void;
}
```

---

### Extending Interfaces

You can also implement inheritance in interfaces.

```ts
interface Named {
  readonly name: string;
}

interface Greetable {
  greet(phrase: string): void;
}

class Person implements Greetable, Named {
  //...
```

```ts
interface Named {
  readonly name: string;
}

interface Greetable extends Named {
  greet(phrase: string): void;
}

class Person implements Greetable {
```

An interface can inherit from more than one interface (≠ than for class).

```ts
interface Greetable extends Named, AnotherInterface {...}
```

---

### Interfaces as Function Types

```ts
// TYPE
type AddFn = (a: number, b: number) => number;

// INTERFACE (alternative)
interface AddFn {
  (a: number, b: number): number; // no method name, same as above
}

let add: AddFn;

add = (n1: number, n2: number) => {
  return n1 + n2;
};
```

---

### Optional Parameters & Properties

```ts
interface Named {
  readonly name?: string; // optional name in interface
  outputName?: string; // optional property
  myMethod?(): void; // optional method
}

//...

class Person implements Greetable {
  name?: string; // optional name in class

  constructor(n?: string) { // n?
    if (n) { // check if n exists
      this.name = n;
    }
  }
```

---

### Compiling Interfaces to JavaScript

In es5 we can't see any reference to any of our interface. JavaScript doesn't know the interface concept. We can use it to improve our code but there is no output for the interface. Pure dev feature, to better code, to improve the structure and readibility. At runtime, no trace of interface.

---

### QUIZZ

#### Interfaces

##### 1. What's a core difference between a class and an interface?

Interfaces can't be instantiated and are not compiled, classes can be instantiated and are compiled. Interfaces are a pure TS feature and can't be instantiated.

##### 2. Which of the following example is NOT a valid use-case for an interface?

You want to store a union type. Interfaces describe objects (or function types) but can't store/ describe arbitrary types like union types.
