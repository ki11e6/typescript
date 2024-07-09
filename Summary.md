# Table of Contents


1. [Generics](#generics)
2. [Decorators](#decorators)
3. [Classes](#classes)
4. [Interfaces](#interfaces)
5. [Object-oriented Programming (OOP)](#object-oriented-programming-oop)
6. [Access Modifiers: "private" and "public"](#access-modifiers-private-and-public)
7. [Shorthand Initialization](#shorthand-initialization)
8. [Readonly Properties](#readonly-properties)
9.  [Inheritance](#inheritance)
10. [Overriding Properties & The "protected" Modifier](#overriding-properties--the-protected-modifier)
11. [Getters & Setters](#getters--setters)
12. [Static Methods & Properties](#static-methods--properties)
13. [Abstract Classes](#abstract-classes)
14. [Singleton](#singleton-pattern)
15. [Advanced Types](#advanced-types)
16. [Interfaces as Function Types](#interfaces-as-function-types)
17. [Optional Parameters & Properties](#optional-parameters--properties)
18. [Compiling Interfaces to JavaScript](#compiling-interfaces-to-javascript)
19. [Function Types & Callbacks](#function-types--callbacks)
20. [Union Types](#union-types)
21. [Intersection Types](#intersection-types)
22. [Type Aliases](#type-aliases)
23. [Type Assertions](#type-assertions)
24. [Literal Types](#literal-types)
25. [Type Guards](#type-guards)
26. [Discriminated Unions](#discriminated-unions)
27. [Nullable Types](#nullable-types)
28. [Type Casting](#type-casting)

---

## TypeScript Basics & Basic Types
**TypeScript**: A superset of JavaScript that helps prevent problems during development by offering static typing.

### Key Differences Between JS and TS
- **JavaScript (JS)**: Dynamically typed (resolved at runtime).
- **TypeScript (TS)**: Statically typed (set during development).

### Example
```typescript
function add(n1: number, n2: number) {
  return n1 + n2;
}
const number1 = '5';
const number2 = 2.8;
const result = add(number1, number2); // Error: Argument of type '"5"' is not assignable to parameter of type 'number'
console.log(result);
```

### Core Primitive Types
- Use `string`, `number` (lowercase).

## Type Inference
TypeScript can infer the data type of a variable when values are assigned.

### Example
```typescript
let number1 = 5; // Inferred as number
number1 = '1'; // Error: Type '"1"' is not assignable to type 'number'
```

### Advantages
- Reduces boilerplate code as explicit type annotations are often unnecessary.
- Improves code readability and maintainability.

### Disadvantages
- May sometimes infer types incorrectly, leading to unexpected errors.

## Object Types
Define object types to describe the shape of objects.

### Example
```typescript
const person1 = {
  name: 'Max',
  age: 30,
};
// TypeScript type inferred: { name: string; age: number; }
```

### Advantages
- Clearly defines the structure of objects.
- Helps catch errors related to object properties early.

### Disadvantages
- Can become verbose for complex objects.

## Array Types
Specify the types of elements in an array.

### Example
```typescript
let favoriteActivities: string[];
favoriteActivities = ['Sports']; // OK
favoriteActivities = ['Sports', 1]; // Error: Type 'number' is not assignable to type 'string'
```

### Advantages
- Ensures all array elements are of the specified type.
- Helps catch errors when manipulating arrays.

### Disadvantages
- Restricts the types of elements that can be added to the array.

## Tuples
Tuples are fixed-length arrays with specified types for each element.

### Example
```typescript
const person: {
  name: string;
  age: number;
  role: [number, string];
} = {
  name: 'Max',
  age: 30,
  role: [2, 'author'],
};
person.role.push('admin'); // Allowed
person.role[1] = 10; // Error: Type 'number' is not assignable to type 'string'
```

### Advantages
- Enforces a specific structure and types for array elements.
- Useful for representing fixed-size collections of related values.

### Disadvantages
- Less flexible than arrays, as the size and types are fixed.

## Enums
Enums are used to define a set of named constants.

### Example
```typescript
enum Role {
  ADMIN,
  READ_ONLY,
  AUTHOR,
}
const person = {
  name: 'Max',
  role: Role.ADMIN,
};
console.log(person.role === Role.ADMIN); // true
```

### Advantages
- Provides a clear and organized way to manage sets of related constants.
- Enhances code readability and maintainability.

### Disadvantages
- Adds complexity to the code.
- May not be necessary for small projects.

## The "any" Type
Avoid using the `any` type as it disables type checking.

### Advantages
- Offers flexibility by allowing any type of value.

### Disadvantages
- Removes the benefits of TypeScript's type checking.
- Can lead to runtime errors.

## Union Types
Union types allow a variable to hold more than one type.

### Example
```typescript
function combine(input1: number | string, input2: number | string) {
  if (typeof input1 === 'number' && typeof input2 === 'number') {
    return input1 + input2;
  } else {
    return input1.toString() + input2.toString();
  }
}
```

### Advantages
- Increases flexibility by allowing multiple types for a variable.
- Helps create more versatile functions.

### Disadvantages
- Adds complexity to type checking and error handling.

## Literal Types
Literal types specify the exact value a string or number must have.

### Example
```typescript
function combine(
  input1: number | string,
  input2: number | string,
  resultConversion: 'as-number' | 'as-text',
) {
  // ...
}
```

### Advantages
- Provides precise control over allowed values.
- Helps catch errors related to invalid values early.

### Disadvantages
- Limits the range of values that can be used.
- Can be restrictive if overused.

## Type Aliases & Object Types
Type aliases create custom types to avoid repetition and manage types centrally.

### Example
```typescript
type User = { name: string; age: number };
const u1: User = { name: 'Max', age: 30 };

function greet(user: User) {
  console.log('Hi, I am ' + user.name);
}
```

### Advantages
- Reduces code duplication.
- Improves code readability and maintainability.

### Disadvantages
- Can become complex if too many aliases are created.
- Requires careful management to avoid confusion.

## Function Return Types & "void"
Define the return type of a function explicitly.

### Example
```typescript
function add(n1: number, n2: number): number {
  return n1 + n2;
}

function printResult(num: number): void {
  console.log('Result: ' + num);
}
```

### Advantages
- Provides clear expectations for function outputs.
- Helps catch errors related to incorrect return types.

### Disadvantages
- Adds verbosity to the code.
- May be redundant if TypeScript can infer the return type.

## Functions as Types
Specify function types to ensure type-safe function assignments.

### Example
```typescript
let combineValues: (a: number, b: number) => number;
combineValues = add; // OK
combineValues = printResult; // Error as printResult is a function that accept two arguments.
```

### Advantages
- Ensures functions are used correctly.
- Helps catch errors related to function usage.

### Disadvantages
- Adds complexity to type definitions.
- Requires additional type annotations.

## The "unknown" Type
The `unknown` type is a safer alternative to `any`.

### Example
```typescript
let userInput: unknown;
let userName: string;

userInput = 5;
userInput = 'Max';

if (typeof userInput === 'string') {
  userName = userInput; // OK
}
```

### Advantages
- Provides type safety while allowing flexibility.
- Helps catch errors by requiring type checks before usage.

### Disadvantages
- Requires additional type checks in the code.
- Can be cumbersome to work with compared to `any`.

## The "never" Type
The `never` type is used for functions that never return a value.

### Example
```typescript
function generateError(message: string, code: number): never {
  throw { message, errorCode: code };
}
```

### Advantages
- Clearly indicates functions that should never return.
- Helps catch errors related to incorrect function behavior.

### Disadvantages
- Limited usage scenarios.
- Adds complexity to type definitions.
---

# The TypeScript Compiler (and its Configuration)

## Useful Resources & Links
- [tsconfig Docs](https://www.typescriptlang.org/tsconfig)
- [Compiler Config Docs](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [VS Code TS Debugging](https://code.visualstudio.com/docs/typescript/typescript-debugging)

## Using "Watch Mode"
Watch mode is a feature that allows TypeScript to automatically recompile your files every time you save them.

### Example
```sh
tsc app.ts --watch
tsc app.ts -w
```
Both commands will compile `app.ts` each time you save it.

### Advantages
- Saves time by automatically recompiling on save.
- Useful for continuous development and testing.

### Disadvantages
- Consumes resources as the compiler runs continuously.
- May slow down development on large projects.

## Compiling the Entire Project / Multiple Files
To compile an entire project, initialize a `tsconfig.json` file in the root of your project.

### Example
```sh
tsc --init
```
This creates a `tsconfig.json` file.

### Alternative
If you've installed TypeScript locally, you can use:
```sh
npx tsc --init
```
to create the `tsconfig.json` file.

### Example `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Advantages
- Centralized configuration for the entire project.
- Simplifies compilation of multiple files.

### Disadvantages
- Requires setup and maintenance.
- Can be complex for large projects with many options.

## Including & Excluding Files
Use `include` and `exclude` in `tsconfig.json` to control which files are compiled.

### Example
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs"
  },
  "exclude": [
    "node_modules",
    "analytics.dev.ts",
    "*.dev.ts"
  ],
  "include": [
    "app.ts"
  ],
  "files": [
    "app.js"
  ]
}
```

### Advantages
- Fine-grained control over which files are compiled.
- Helps to exclude unnecessary files from compilation.

### Disadvantages
- Requires manual specification of files/folders.
- Can lead to errors if important files are excluded.

## Setting a Compilation Target
Specify the target ECMAScript version in `tsconfig.json`.

### Example
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs"
  }
}
```

### Advantages
- Ensures compatibility with older environments.
- Allows use of modern JavaScript features while maintaining compatibility.

### Disadvantages
- May require polyfills for newer features.
- Can limit use of the latest JavaScript syntax.

## Understanding TypeScript Core Libs
Specify default objects and features TypeScript should be aware of using `lib`.

### Example
```json
{
  "compilerOptions": {
    "lib": [
      "dom",
      "es6",
      "dom.iterable",
      "scripthost"
    ]
  }
}
```

### Advantages
- Provides access to specific global variables and APIs.
- Ensures compatibility with specified environments.

### Disadvantages
- Must be manually configured for each project.
- Incorrect configuration can lead to missing or undefined features.

## Working with Source Maps
Source maps facilitate debugging by mapping compiled JavaScript back to TypeScript.

### Example
```json
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

### Advantages
- Simplifies debugging in browsers.
- Allows setting breakpoints in TypeScript files.

### Disadvantages
- Increases file size and compilation time.
- Requires configuration in development tools.

## rootDir and outDir
Organize your project by setting input and output directories.

### Example
```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### Advantages
- Keeps source files and compiled files separate.
- Simplifies project structure and management.

### Disadvantages
- Requires setup and configuration.
- May add complexity to build process.

## Stop Emitting Files on Compilation Errors
Prevent compilation if there are errors using `noEmitOnError`.

### Example
```json
{
  "compilerOptions": {
    "noEmitOnError": true
  }
}
```

### Advantages
- Ensures code quality by not compiling erroneous code.
- Helps catch and fix errors early.

### Disadvantages
- Halts the build process if there are errors.
- Requires all errors to be fixed before compilation.

## Strict Compilation
Enable strict type-checking options for better code quality.

### Example
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

### Advantages
- Ensures robust and error-free code.
- Helps catch potential issues early.

### Disadvantages
- Can be restrictive and require more type annotations.
- May increase initial development time.

## Code Quality Options
Enable additional checks to ensure code quality.

### Example
```json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Advantages
- Helps maintain clean and readable code.
- Catches common coding mistakes.

### Disadvantages
- May require additional configuration.
- Can produce many warnings/errors that need fixing.

---

# Next-generation JavaScript & TypeScript

## "let" and "const"
### Block Scope with `let` and `const`
- `let` is "block scoped" (inside `{}`).
- `const` is used for constants and cannot be reassigned.

### Examples
```typescript
const aName = 'Max';
console.log(aName);
aName = 'Antoine'; // Error: Assignment to constant variable.

let age = 30;
age = 29; // Works because let allows reassignment.

if (age > 20) {
  var isOldWithVar = true;
}

console.log(isOldWithVar); // Works because var is function-scoped.

if (age > 20) {
  let isOldWithLet = true;
}

console.log(isOldWithLet); // Error: isOldWithLet is not defined.
```

### Advantages
- `let` and `const` provide better scoping, preventing accidental global variables.
- `const` ensures variables are not reassigned, improving code stability.

### Disadvantages
- Requires understanding of scoping rules.
- May need adjustments in legacy code that uses `var`.

## Arrow Functions
Arrow functions provide a concise syntax for writing functions.

### Examples
```typescript
const add = (a: number, b: number) => {
  return a + b;
};

// With a single expression
const addShort = (a: number, b: number) => a + b;

// With a single parameter
const printOutput: (a: number | string) => void = (output) =>
  console.log(output);

printOutput(add(5, 2));
```

### Advantages
- Shorter syntax.
- Lexical `this` binding.

### Disadvantages
- Not suitable for all use cases (e.g., methods in classes).

## Default Function Parameters
Set default values for function parameters.

### Examples
```typescript
const add = (a: number, b: number = 1) => a + b;

const printOutput: (a: number | string) => void = (output) =>
  console.log(output);

printOutput(add(5)); // Outputs: 6
```

### Advantages
- Simplifies function calls by providing default values.

### Disadvantages
- Default parameters must be the last in the parameter list.

## The Spread Operator (...)
Expands arrays or objects into individual elements.

### Examples
```typescript
const hobbies = ['Sports', 'Cooking'];
const activeHobbies = ['Hiking'];
activeHobbies.push(...hobbies); // Merges hobbies into activeHobbies.

const person = {
  name: 'Max',
  age: 30,
};

const copiedPersonShallow = person; // Shallow copy
const copiedPersonDeep = { ...person }; // Deep copy
```

### Advantages
- Simplifies merging arrays or objects.
- Creates shallow or deep copies.

### Disadvantages
- Shallow copy does not handle nested objects.

## Rest Parameters
Aggregates multiple arguments into an array.

### Examples
```typescript
const add = (...numbers: number[]) => {
  return numbers.reduce((acc, num) => acc + num, 0);
};

const addedNumbers = add(1, 3, 10, 5.5, 3.7);
console.log(addedNumbers); // Outputs: 23.2
```

### Advantages
- Flexible way to handle multiple arguments.

### Disadvantages
- Rest parameters must be the last in the parameter list.

## Array & Object Destructuring
Extracts values from arrays or properties from objects into distinct variables.

### Examples
```typescript
const hobbies = ['Sport', 'Cooking'];
const [hobby1, hobby2, ...remainingHobbies] = hobbies; // Array destructuring

const person = {
  firstName: 'Max',
  age: 30,
};

const { firstName: userName, age } = person; // Object destructuring

console.log(userName, age); // Outputs: Max 30
```

### Advantages
- Cleaner and more readable code.
- Avoids the need for temporary variables.

### Disadvantages
- Can be confusing for new developers.
- Overuse can make code harder to understand.
---

## Classes
**Definition**: Blueprints for objects that define properties and methods.
**Use**: To create objects with a predefined structure and behavior.
**Example**:
```typescript
class Department {
  name: string;

  constructor(n: string) {
    this.name = n;
  }

  describe() {
    console.log('Department: ' + this.name);
  }
}

const accounting = new Department('Accounting');
accounting.describe(); // Department: Accounting
```
**Advantages**:
- Encapsulation of data and behavior.
- Code reuse through inheritance.
- Improved code readability and maintainability.
**Disadvantages**:
- Can lead to complex hierarchies.
- May be overkill for simple structures.

## Object-Oriented Programming (OOP)
**Definition**: A programming paradigm based on the concept of "objects" which can contain data and code to manipulate that data.
**Use**: To model real-world entities and relationships in code.
**Example**:
```typescript
class Car {
  model: string;
  speed: number;

  constructor(model: string, speed: number) {
    this.model = model;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(this.model + ' is going ' + this.speed + ' km/h');
  }
}

const tesla = new Car('Tesla', 50);
tesla.accelerate(); // Tesla is going 60 km/h
```
**Advantages**:
- Promotes modularity and code reuse.
- Facilitates maintenance and modification of code.
- Makes it easier to manage large codebases.
**Disadvantages**:
- Can lead to increased complexity.
- Requires careful design to avoid issues like tight coupling.

## Constructor Functions
**Definition**: Functions used to initialize new objects in a class.
**Use**: To set up initial values and state for an object when it is created.
**Example**:
```typescript
class Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const john = new Person('John');
console.log(john.name); // John
```
**Advantages**:
- Ensures objects are properly initialized.
- Provides a clear and consistent way to create objects.
**Disadvantages**:
- Can make class definitions longer and more complex.
- Requires understanding of the `this` keyword.

## Access Modifiers: Private and Public
**Definition**: Keywords used to control access to class properties and methods.
**Use**: To encapsulate data and restrict access to class internals.
**Example**:
```typescript
class Department {
  private employees: string[] = [];
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployees() {
    console.log(this.employees);
  }
}

const hr = new Department('HR');
hr.addEmployee('Alice');
hr.printEmployees(); // ['Alice']
```
**Advantages**:
- Protects internal state of objects.
- Enforces encapsulation.
**Disadvantages**:
- Can add verbosity to class definitions.
- May require additional methods to access private data.

## Shorthand Initialization
**Definition**: A concise way to define and initialize class properties directly in the constructor.
**Use**: To reduce boilerplate code when defining classes.
**Example**:
```typescript
class Department {
  private employees: string[] = [];

  constructor(private id: string, public name: string) {}
}

const dept = new Department('d1', 'Finance');
console.log(dept.name); // Finance
```
**Advantages**:
- Reduces code duplication.
- Improves readability.
**Disadvantages**:
- May reduce clarity if overused.

## Readonly Properties
**Definition**: Properties that cannot be changed after initialization.
**Use**: To create immutable properties.
**Example**:
```typescript
class Department {
  private employees: string[] = [];

  constructor(private readonly id: string, public name: string) {}
}

const dept = new Department('d1', 'Finance');
console.log(dept.id); // d1
// dept.id = 'd2'; // Error: Cannot assign to 'id' because it is a read-only property.
```
**Advantages**:
- Ensures certain data cannot be modified.
- Improves data integrity.
**Disadvantages**:
- Less flexibility in modifying object state.

## Inheritance
**Definition**: A mechanism to create a new class based on an existing class.
**Use**: To extend functionality of a base class.
**Example**:
```typescript
class Department {
  constructor(public name: string) {}

  describe() {
    console.log('Department: ' + this.name);
  }
}

class ITDepartment extends Department {
  admins: string[];

  constructor(name: string, admins: string[]) {
    super(name);
    this.admins = admins;
  }

  printAdmins() {
    console.log(this.admins);
  }
}

const itDept = new ITDepartment('IT', ['Alice', 'Bob']);
itDept.describe(); // Department: IT
itDept.printAdmins(); // ['Alice', 'Bob']
```
**Advantages**:
- Promotes code reuse.
- Establishes a natural hierarchy.
**Disadvantages**:
- Can lead to tight coupling between classes.
- Can make debugging and testing more difficult.

## Protected Modifier
**Definition**: A keyword to allow access to class properties and methods in derived classes.
**Use**: To share functionality between parent and child classes while still restricting external access.
**Example**:
```typescript
class Department {
  protected employees: string[] = [];

  constructor(public name: string) {}

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployees() {
    console.log(this.employees);
  }
}

class ITDepartment extends Department {
  constructor(name: string, private admins: string[]) {
    super(name);
  }

  printAdmins() {
    console.log(this.admins);
  }
}

const itDept = new ITDepartment('IT', ['Alice', 'Bob']);
itDept.addEmployee('Max');
itDept.printEmployees(); // ['Max']
itDept.printAdmins(); // ['Alice', 'Bob']
```
**Advantages**:
- Balances encapsulation and inheritance.
- Allows derived classes to access necessary internals.
**Disadvantages**:
- Can make class internals more accessible than desired.
- Requires careful design to avoid misuse.

## Getters and Setters
**Definition**: Methods to get and set the value of a class property.
**Use**: To control access to properties and provide additional logic.
**Example**:
```typescript
class Department {
  private employees: string[] = [];
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(newName: string) {
    if (newName.length > 0) {
      this._name = newName;
    } else {
      throw new Error('Name must not be empty.');
    }
  }
}

const dept = new Department('Finance');
console.log(dept.name); // Finance
dept.name = 'HR';
console.log(dept.name); // HR
// dept.name = ''; // Error: Name must not be empty.
```
**Advantages**:
- Encapsulates property access.
- Allows validation and transformation of data.
**Disadvantages**:
- Can add complexity.
- May be overused for simple properties.

## Static Methods and Properties
**Definition**: Methods and properties that belong to the class itself rather than instances of the class.
**Use**: To provide utility functions and constants.
**Example**:
```typescript
class Department {
  static fiscalYear = 2024;

  static createEmployee(name: string) {
    return { name: name };
  }
}

const employee = Department.createEmployee('Alice');
console.log(employee); // { name: 'Alice' }
console.log(Department.fiscalYear); // 2024
```
**Advantages**:
- Useful for functions that do not depend on instance state.
- Can be accessed without creating an instance.

**Disadvantages**:
- Cannot access instance-specific data.
- May lead to less object-oriented design.

## Abstract Classes
**Definition**: Classes that cannot be instantiated and are meant to be extended by other classes.
**Use**: To define common behavior that must be implemented by derived classes.
**Example**:
```typescript
abstract class Department {
  constructor(public name: string) {}

  abstract describe(): void;
}

class ITDepartment extends Department {
  describe() {
    console.log('IT Department: ' + this.name);
  }
}

const itDept = new ITDepartment('IT');
itDept.describe(); // IT Department: IT
```
**Advantages**:
- Enforces a contract for derived classes.
- Promotes code consistency.

**Disadvantages**:
- Cannot be instantiated directly.
- Requires careful design to avoid rigid hierarchies.

## Singleton Pattern
**Definition**: A design pattern that restricts a class to a single instance.
**Use**: To ensure only one instance of a class exists.
**Example**:
```typescript
class AccountingDepartment extends Department {
  private static instance: AccountingDepartment;

  private constructor(name: string) {
    super(name);
  }

  static getInstance() {
    if (!AccountingDepartment.instance) {
      AccountingDepartment.instance = new AccountingDepartment('Accounting');
    }
    return AccountingDepartment.instance;
  }
}

const accounting1 = AccountingDepartment.getInstance

();
const accounting2 = AccountingDepartment.getInstance();

console.log(accounting1 === accounting2); // true
```
**Advantages**:
- Reduces memory usage.
- Ensures consistent state.
**Disadvantages**:
- Can introduce global state.
- May be difficult to test.

## Interfaces
**Definition**: Describes the structure of an object without providing implementation details.
**Use**: To define contracts for classes and objects.
**Example**:
```typescript
interface Person {
  name: string;
  age: number;

  greet(phrase: string): void;
}

let user: Person;

user = {
  name: 'John',
  age: 30,
  greet(phrase: string) {
    console.log(phrase + ' ' + this.name);
  }
};

user.greet('Hello'); // Hello John
```
**Advantages**:
- Promotes consistent structure.
- Encourages type safety.
**Disadvantages**:
- Cannot be instantiated.
- Adds complexity to type definitions.

## Extending Interfaces
**Definition**: A way to create a new interface based on existing interfaces.
**Use**: To build on existing contracts and create more specific interfaces.
**Example**:
```typescript
interface Named {
  name: string;
}

interface Greetable extends Named {
  greet(phrase: string): void;
}

class Person implements Greetable {
  constructor(public name: string, public age: number) {}

  greet(phrase: string) {
    console.log(phrase + ' ' + this.name);
  }
}

let user: Greetable = new Person('John', 30);
user.greet('Hello'); // Hello John
```
**Advantages**:
- Promotes code reuse.
- Enables flexible and modular design.
**Disadvantages**:
- Can lead to complex and interdependent interfaces.
- May be harder to understand and maintain.

## Interfaces as Function Types
**Definition**: Describes the shape of a function, including parameter types and return type.
**Use**: To define and enforce function signatures.
**Example**:
```typescript
interface AddFn {
  (a: number, b: number): number;
}

let add: AddFn;

add = (n1: number, n2: number) => {
  return n1 + n2;
};

console.log(add(2, 3)); // 5
```
**Advantages**:
- Improves type safety.
- Provides clear documentation of function behavior.
**Disadvantages**:
- Adds verbosity to type definitions.
- Requires understanding of function type syntax.

## Optional Parameters and Properties
**Definition**: Parameters and properties that are not required.
**Use**: To provide flexibility in function calls and object structures.
**Example**:
```typescript
interface Person {
  name: string;
  age?: number; // optional property
}

function greet(person: Person) {
  console.log('Hello ' + person.name);
  if (person.age) {
    console.log('Age: ' + person.age);
  }
}

let user1: Person = { name: 'Alice' };
let user2: Person = { name: 'Bob', age: 25 };

greet(user1); // Hello Alice
greet(user2); // Hello Bob, Age: 25
```
**Advantages**:
- Improves code flexibility.
- Allows for more concise and readable code.
**Disadvantages**:
- Can lead to less predictable behavior.
- Requires additional checks for undefined values.

---
# Advanced Types

## Useful Resources & Links
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [TypeScript GitHub Repository](https://github.com/microsoft/TypeScript)
- [TypeScript on Stack Overflow](https://stackoverflow.com/questions/tagged/typescript)

## More on Advanced Types

### Intersection Types
**Definition**: Combines multiple types into one. The resulting type has all properties of the intersected types.
**Use**: To merge properties of multiple types.
**Example**:
```typescript
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee; // intersection type

const e1: ElevatedEmployee = {
  name: 'Max',
  privileges: ['create-server'],
  startDate: new Date(),
};
```
**Advantages**:
- Combines properties of multiple types.
- Useful for creating comprehensive type definitions.
**Disadvantages**:
- Can become complex with many intersecting types.
- Might lead to unexpected type combinations.

### Type Guards
**Definition**: Checks to ensure the type of a variable before performing operations on it.
**Use**: To avoid runtime errors by verifying types.
**Example**:
```typescript
type Combinable = string | number;

function add(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}
```
**Advantages**:
- Prevents runtime errors.
- Provides type safety.
**Disadvantages**:
- Adds extra code for type checks.
- Can make functions longer and more complex.

### Type Guards with Classes
**Definition**: Uses class types to check the type of an object.
**Use**: To perform type checks in object-oriented code.
**Example**:
```typescript
class Car {
  drive() {
    console.log('Driving...');
  }
}

class Truck {
  drive() {
    console.log('Driving a truck...');
  }

  loadCargo(amount: number) {
    console.log('Loading cargo...' + amount);
  }
}

type Vehicle = Car | Truck;

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

const v1 = new Car();
const v2 = new Truck();

useVehicle(v1);
useVehicle(v2);
```
**Advantages**:
- Allows for specific behavior based on the class type.
- More elegant and less error-prone than property checks.
**Disadvantages**:
- Requires knowledge of class hierarchy.
- Can be overkill for simple type checks.

### Discriminated Unions
**Definition**: Combines types with a common property to make type checks easier.

**Use**: To simplify type checks in union types.

**Example**:
```typescript
interface Bird {
  type: 'bird';
  flyingSpeed: number;
}

interface Horse {
  type: 'horse';
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  let speed;
  switch (animal.type) {
    case 'bird':
      speed = animal.flyingSpeed;
      break;
    case 'horse':
      speed = animal.runningSpeed;
      break;
  }

  console.log('Moving with speed: ', speed);
}

moveAnimal({ type: 'bird', flyingSpeed: 10 });
```
**Advantages**:
- Simplifies type checks.
- Reduces repetitive code.
**Disadvantages**:
- Requires adding a common property to all types.
- Can be less flexible for complex hierarchies.

### Type Casting
**Definition**: Tells TypeScript to treat a variable as a different type.

**Use**: To inform TypeScript of a specific type in ambiguous situations.

**Example**:
```typescript
const userInputElement = document.getElementById('user-input') as HTMLInputElement;
userInputElement.value = 'Hi there!';
```
**Advantages**:
- Provides type safety.
- Allows for precise type control.
**Disadvantages**:
- Can lead to runtime errors if used incorrectly.
- Reduces type safety if overused.

### Index Properties
**Definition**: Allows creating types with properties of unknown names but known types.
**Use**: To define objects with dynamic property names.
**Example**:
```typescript
interface ErrorContainer {
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  email: 'Not a valid email',
  username: 'Must start with a character!',
};
```
**Advantages**:
- Supports dynamic object structures.
- Useful for flexible data models.
**Disadvantages**:
- Can be harder to debug.
- Less strict type checking.

### Function Overloads
**Definition**: Allows defining multiple function signatures for a single function implementation.
**Use**: To handle different types of inputs in a function.
**Example**:
```typescript
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
function add(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}
```
**Advantages**:
- Provides flexibility in function usage.
- Ensures type safety.
**Disadvantages**:
- Can make function definitions complex.
- Requires careful implementation to avoid errors.

### Optional Chaining
**Definition**: Safely accesses nested properties without causing errors if a property is `null` or `undefined`.
**Use**: To simplify access to deeply nested properties.
**Example**:
```typescript
const fetchedUserData = {
  id: 'u1',
  name: 'Max',
  // job: { title: 'CEO', description: 'My own company' },
};

console.log(fetchedUserData?.job?.title);
```
**Advantages**:
- Reduces code for null checks.
- Improves readability.
**Disadvantages**:
- Can mask underlying issues.
- May lead to unexpected undefined values.

### Nullish Coalescing
**Definition**: Provides a default value if a variable is `null` or `undefined`.

**Use**: To ensure a value is not `null` or `undefined`.

**Example**:
```typescript
const userInput = null;
const storedData = userInput ?? 'DEFAULT';
```
**Advantages**:
- Prevents null-related errors.
- Simplifies value initialization.
**Disadvantages**:
- Can obscure the source of null values.
- Requires understanding of `null` vs `undefined`.
---

### Generics

#### Useful Resources & Links
- [TypeScript Generics Official Documentation](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Generics in TypeScript](https://basarat.gitbook.io/typescript/type-system/generics)
- [Understanding TypeScript Generics](https://www.typescriptlang.org/docs/handbook/advanced-types.html#generics)

---

### Built-in Generics & What are Generics?

**What are Generics?**

Generics provide a way to create reusable components that can work with different types rather than a single one. This helps to make components more flexible and maintainable.

**Why Use Generics?**
- **Advantages:**
  - **Reusability:** Write functions, classes, and interfaces that work with any type.
  - **Type Safety:** Ensure type safety across different types of data.
  - **Clarity:** Enhance code readability and maintainability.

- **Disadvantages:**
  - **Complexity:** Can add complexity to the code, making it harder for beginners to understand.
  - **Inference Challenges:** Sometimes TypeScript's type inference can struggle with more complex generic types.

**Examples:**

```typescript
const names: Array<string> = ['Max', 'Manuel']; // same as string[]
names[0].split(' ');

const promise: Promise<string> = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('This is done!');
  }, 2000);
});

promise.then((data) => {
  data.split(' '); // because of the generic type I tell TS data will be string
});
```

### Creating a Generic Function

**Problem:**

```typescript
function merge(objA: object, objB: object) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Max' }, { age: 30 });
mergedObj.name; // KO – Property 'name' does not exist on type 'object'.
```

**Solution:**

Creating generic types:

```typescript
function merge<T, U>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj1 = merge({ name: 'Max' }, { age: 30 });
// This is what is happening below
// const mergedObj1 = merge<{name:string}, {age: number}>({ name: 'Max' }, { age: 30 });
const mergedObj2 = merge({ name: 'Max', hobbies: ['sport'] }, { age: 30 });
mergedObj1.name; // OK
mergedObj2.age; // OK
```

Generics create specific types dynamically when we call the function. The convention is to start with `T`.

### Working with Constraints

Constraints ensure that the types used with generics meet certain criteria.

**Example:**

```typescript
function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

const mergedObj = merge({ name: 'Max', hobbies: ['sport'] }, 30); // KO – Argument of type '30' is not assignable to parameter of type 'object'.
```

### Another Generic Function

**Example:**

```typescript
interface Lengthy {
  length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let description = 'Got no value.';
  if (element.length === 1) {
    description = 'Got 1 element.';
  } else if (element.length > 1) {
    description = 'Got ' + element.length + ' elements.';
  }
  return [element, description];
}

console.log(countAndDescribe('Hi there!'));
console.log(countAndDescribe(['sport', 'cooking']));
console.log(countAndDescribe([]));
```

### The "keyof" Constraint

**Example:**

```typescript
function extractAndConvert(obj: object, key: string) {
  return obj[key];
  // KO – Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
  // KO – No index signature with a parameter of type 'string' was found on type '{}'.
}

function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
  return obj[key];
}

extractAndConvert({}, 'name'); // KO – Argument of type '"name"' is not assignable to parameter of type 'never'.
extractAndConvert({ name: 'Max' }, 'name'); // OK
```

### Generic Classes

**Example:**

```typescript
class DataStorage<T> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('Max');
textStorage.addItem('Manu');
textStorage.removeItem('Manu');
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();
numberStorage.addItem(1);
numberStorage.addItem(2);
numberStorage.removeItem(3);
console.log(numberStorage.getItems());
```

### Generic Utility Types

**Partial<T>:**

```typescript
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(title: string, description: string, date: Date): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  // Do validation
  courseGoal.description = description;
  // Do whatever
  courseGoal.completeUntil = date;
  return courseGoal as CourseGoal;
}
```

**Readonly<T>:**

```typescript
const newNames: Readonly<string[]> = ['Max', 'Anna'];
newNames.push('Manu'); // KO – Property 'push' does not exist on type 'readonly string[]'.
```

### Generic Types vs Union Types

**Difference:**

- **Generic Types:** Provide type safety and flexibility by creating components that can work with any type.
- **Union Types:** Allow variables to hold multiple types but do not provide the same level of flexibility and type safety as generics.

Sure, let's expand the provided content on "Decorators" with explanations, advantages, disadvantages, and examples.

---

### Decorators

#### Useful Resources & Links
- [TypeScript Decorators Official Documentation](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [Understanding Decorators](https://www.digitalocean.com/community/tutorials/understanding-decorators-in-javascript)

---

### A First Class Decorator

**What are Decorators?**

Decorators are special functions that can be attached to classes, methods, properties, or parameters to add additional behavior or metadata. They are a powerful feature of TypeScript and are widely used in frameworks like Angular.

**Why Use Decorators?**
- **Advantages:**
  - **Meta-Programming:** Simplify meta-programming by allowing annotations and a declarative syntax.
  - **Code Reusability:** Promote reusability and separation of concerns by encapsulating behavior.
  - **Code Readability:** Enhance code readability and maintainability.

- **Disadvantages:**
  - **Complexity:** Can add complexity to the code, making it harder for beginners to understand.
  - **Debugging:** Can be more difficult to debug due to the implicit behavior they introduce.

**Examples:**

```typescript
function Logger(constructor: Function) {
  console.log('Logging...');
  console.log(constructor);
}

@Logger
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();
console.log(pers);
```

### Working with Decorator Factories

**Decorator Factory:**

A decorator factory is a function that returns a decorator function.

```typescript
function Logger(logString: string) {
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

@Logger('LOGGING - PERSON')
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();
console.log(pers);
```

### Building More Useful Decorators

**Example:**

```typescript
function withTemplate(template: string, hookId: string) {
  return function (_: Function) {
    const hookEl = document.getElementById(hookId);
    if (hookEl) {
      hookEl.innerHTML = template;
    }
  };
}

@withTemplate('<h1>My Person Class</h1>', 'app') // We need to add "<div id="app"></div>" in index.html
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();
console.log(pers);
```

Another variant:

```typescript
function withTemplate(template: string, hookId: string) {
  return function (constructor: any) {
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('h1')!.textContent = p.name;
    }
  };
}
```

### Adding Multiple Decorators

You can apply multiple decorators to a class. Decorators are executed in a bottom-up manner.

```typescript
@Logger('LOGGING - PERSON')
@withTemplate('<h1>My Person Class</h1>', 'app')
class Person {
  name = 'Max';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();
console.log(pers);
```

### Diving into Property Decorators

**Example:**

```typescript
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

class Product {
  @Log
  title: string;
  private _price: number;

  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price – should be positive!');
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}
```

### Accessor & Parameter Decorators

**Examples:**

```typescript
// Property / Field decorator
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator!');
  console.log(target, propertyName);
}

// Accessor decorator
function Log2(target: any, name: string | Symbol, descriptor: PropertyDescriptor) {
  console.log('Accessor decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// Method decorator
function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor) {
  console.log('Method decorator!');
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

// Parameter decorator
function Log4(target: any, name: string | Symbol, position: number) {
  console.log('Parameter decorator!');
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Invalid price – should be positive!');
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}
```

### When Do Decorators Execute?

Decorators run without instantiating the class (without calling `new`). They allow us to do "behind the scenes" work when the class is defined.

### Returning (and Changing) a Class in a Class Decorator

**Example:**

```typescript
function withTemplate(template: string, hookId: string) {
  return function <T extends { new (...args: any[]): { name: string } }>(originalConstructor: T) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        console.log('Rendering template');
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    };
  };
}
```

### Other Decorator Return Types

Only decorators for accessors and methods can return something. Property/field and parameter decorators can also return something but TypeScript will ignore it.

### Example: Creating an "Autobind" Decorator

**Example:**

```typescript
class Printer {
  message = 'This works!';

  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector('button');
button?.addEventListener('click', p.showMessage); // undefined
```

A workaround:

```typescript
button?.addEventListener('click', p.showMessage.bind(p));
```

**Autobind Decorator:**

```typescript
function Autobind(_: any, _2: string | Symbol, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this); // Here the this is bound
      return boundFn;
    },
  };
  return adjDescriptor;
}

class Printer {
  message = 'This works!';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector('button');
button?.addEventListener('click', p.showMessage);
```

### Validation with Decorators – First Steps

**Example:**

```typescript
function Required() {}

function PositiveNumber() {}

function validate(obj: object) {}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;
courseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);
  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');
    return;
  }
  console.log(createdCourse);
});
```

### Validation with Decorators – Finished

**Example:**

```typescript
interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[]; // e.g. ['required', 'positive']
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name][propName] || []),
      'required',
    ],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(

registeredValidators[target.constructor.name][propName] || []),
      'positive',
    ],
  };
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true;
  }

  let isValid = true;
  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          isValid = isValid && !!obj[prop];
          break;
        case 'positive':
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form')!;

courseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);
  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');
    return;
  }
  console.log(createdCourse);
});
```

---

Decorators provide a powerful way to add functionality and behavior to your classes, properties, methods, and parameters. They enable clean, readable, and maintainable code, especially in complex applications. However, they should be used judiciously to avoid unnecessary complexity.