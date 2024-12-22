# TypeScript Features: Declaration Merging and Type Inference

## Declaration Merging

### What is Declaration Merging?
Declaration merging in TypeScript allows multiple declarations with the same name to be combined into a single definition. This feature enables extending existing types, interfaces, or modules without modifying the original declaration.

---

### How Declaration Merging Works
When TypeScript encounters multiple declarations with the same name, it merges them based on the type of declaration (e.g., interfaces, namespaces, or classes).

---

### **1. Interface Merging**
When two or more interfaces with the same name are declared, TypeScript merges their properties into a single interface.

#### **Example: Interface Merging**
```typescript
interface User {
    name: string;
}

interface User {
    age: number;
}

const user: User = {
    name: "Sharath",
    age: 25,
};
```

#### **Rules for Interface Merging**
- **Property Types**: If a property is declared in multiple interfaces, their types must be compatible.
- **Method Overloading**: For methods, TypeScript creates a union of the overloads in the order they appear.

---

### **2. Type Merging**
While TypeScript doesn’t support direct type merging like interfaces, similar behavior can be achieved using **intersection types** (`&`).

#### **Example: Type Merging with Intersection Types**
```typescript
type Address = {
    street: string;
};

type Contact = {
    phone: string;
};

type UserDetails = Address & Contact;

const details: UserDetails = {
    street: "Main Road",
    phone: "123-456-7890",
};
```

#### Differences Between Interface and Type Merging
- **Interfaces can merge** directly by declaring multiple declarations with the same name.
- **Types cannot merge directly**, but intersection types allow combining multiple types into one.

---

### **3. Namespace Merging**
Namespaces can be merged with other namespaces or other types (e.g., classes, functions). This is useful for extending functionality.

#### **Example: Namespace Merging**
```typescript
namespace MathUtils {
    export function add(a: number, b: number): number {
        return a + b;
    }
}

namespace MathUtils {
    export function subtract(a: number, b: number): number {
        return a - b;
    }
}

console.log(MathUtils.add(5, 3)); // Output: 8
console.log(MathUtils.subtract(5, 3)); // Output: 2
```

---

### **4. Class Merging with Namespace**
You can merge a namespace with a class to add additional static methods or properties.

#### **Example: Class and Namespace Merging**
```typescript
class Person {
    constructor(public name: string) {}
}

namespace Person {
    export const defaultName = "Anonymous";
}

const person = new Person(Person.defaultName);
console.log(person.name); // Output: Anonymous
```

---

### **5. Function Merging with Namespace**
Functions can also be extended using namespaces.

#### **Example: Function and Namespace Merging**
```typescript
function greet(name: string): string {
    return `Hello, ${name}!`;
}

namespace greet {
    export const defaultName = "Guest";
}

console.log(greet(greet.defaultName)); // Output: Hello, Guest!
```

---

### Why Use Declaration Merging?
1. **Extend Existing Definitions**: Add custom properties or methods to libraries without modifying their original code.
2. **Augment Third-Party Libraries**: Extend interfaces or modules from third-party libraries.
3. **Enhance Readability**: Organize related functionalities under a single name.

### Common Use Cases
#### **Augmenting Type Definitions**
Declaration merging is often used to augment third-party library definitions:
```typescript
declare namespace Express {
    export interface Request {
        user?: { id: string; name: string };
    }
}
```

#### **Organizing Code**
Merging namespaces with classes or functions helps organize related utilities in one place.

### Best Practices
1. **Avoid Conflicts**: Ensure merged declarations don’t introduce incompatible types or properties.
2. **Use Sparingly**: Overusing declaration merging can make code harder to maintain.
3. **Prefer Type Augmentation for Libraries**: When extending third-party libraries, always use `declare` to avoid polluting the global namespace.

---

## TypeScript Infers Types

### What is Type Inference?
Type inference in TypeScript refers to the compiler’s ability to automatically determine the type of a variable, expression, or function return value based on its value or usage, even if no explicit type annotation is provided.

---

### **How Type Inference Works**

#### **Variable Type Inference**
TypeScript infers the type of a variable based on its initial value:
```typescript
let name = "Sharath"; // TypeScript infers 'string'
let age = 25;         // TypeScript infers 'number'
let isActive = true;   // TypeScript infers 'boolean'
```
If a value of a different type is assigned later, TypeScript will throw an error:
```typescript
age = "twenty-five"; // Error: Type 'string' is not assignable to type 'number'.
```

#### **Function Return Type Inference**
TypeScript infers the return type of a function based on its implementation:
```typescript
function add(a: number, b: number) {
    return a + b; // TypeScript infers the return type as 'number'
}
```

#### **Array and Object Inference**
TypeScript infers the type of arrays and objects based on their elements and properties:
```typescript
let numbers = [1, 2, 3]; // TypeScript infers 'number[]'
let user = {
    name: "Sharath",
    age: 25,
}; // TypeScript infers { name: string; age: number; }
```

---

### **Benefits of Type Inference**
1. **Less Boilerplate Code**: No need for explicit annotations, reducing verbosity.
2. **Strong Typing**: TypeScript ensures type safety based on inferred types.
3. **Improved Developer Experience**: Code remains concise while retaining type safety.

---

### **Limitations of Inference**
1. **Ambiguity**: If TypeScript cannot deduce a specific type, it may infer a broader type like `any`:
   ```typescript
   let something; // TypeScript infers 'any'
   something = 42; // 'something' can hold any type
   something = "hello";
   ```

2. **Complex Cases**: Explicit annotations might be needed in complex scenarios to clarify intent or avoid ambiguity.

---

### Example of TypeScript Inference in Action
```typescript
function getFullName(firstName: string, lastName: string) {
    return `${firstName} ${lastName}`; // TypeScript infers return type as 'string'
}

const fullName = getFullName("Sharath", "Nair"); // 'fullName' is inferred as 'string'
```

---

### **Best Practices for Type Inference**
1. Use inference where it makes the code cleaner and intuitive.
2. Provide explicit types in public APIs or when the intent isn't clear.
3. Avoid uninitialized variables, as they default to `any`.

---

# TypeScript Literal Types

TypeScript literal types allow you to specify exact values a variable can hold, rather than just general types like `string`, `number`, or `boolean`. Literal types can be strings, numbers, booleans, or even unique `const` objects. They are helpful for creating specific and constrained types that provide better type-checking and autocomplete in development.

## Examples of Literal Types

### String Literal Types
```typescript
let direction: "left" | "right" | "up" | "down";
direction = "left";  // ✅ Allowed
direction = "forward"; // ❌ Error: Type '"forward"' is not assignable to type '"left" | "right" | "up" | "down"'.
```

### Numeric Literal Types
```typescript
let count: 1 | 2 | 3;
count = 2; // ✅ Allowed
count = 5; // ❌ Error: Type '5' is not assignable to type '1 | 2 | 3'.
```

### Boolean Literal Types
```typescript
let isActive: true;
isActive = true;  // ✅ Allowed
isActive = false; // ❌ Error: Type 'false' is not assignable to type 'true'.
```

### Combining with Type Aliases
You can use literal types with type aliases for reusability:
```typescript
type CardinalDirection = "north" | "south" | "east" | "west";
let direction: CardinalDirection;

direction = "north";  // ✅ Allowed
direction = "northeast"; // ❌ Error
```

### Literal Types in Function Parameters
Literal types can also be used to constrain function arguments:
```typescript
function move(direction: "left" | "right" | "up" | "down") {
  console.log(`Moving ${direction}`);
}

move("up");    // ✅ Allowed
move("back");  // ❌ Error
```

### Using with Discriminated Unions
Literal types often combine with discriminated unions for type-safe, pattern-matching-like behavior:
```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function getArea(shape: Shape): number {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  } else if (shape.kind === "square") {
    return shape.side ** 2;
  }
}

const circle: Shape = { kind: "circle", radius: 10 };
console.log(getArea(circle)); // Works
```

## Benefits of Literal Types
1. **Type Safety**: Helps catch errors at compile time by restricting values to specific literals.
2. **Better Autocomplete**: IDEs can provide specific suggestions for values.
3. **Improved Code Readability**: Clearly defines the acceptable range of values for a variable or parameter.

Literal types are often used in **union types**, **discriminated unions**, and **type guards** to provide powerful and expressive type constraints in TypeScript.

---

## Type Guards and Type Narrowing

When using "Type Guards" (i.e., if statements that check which concrete type is being used), TypeScript performs so-called "Type Narrowing".

This means that TypeScript is able to narrow a broader type down to a more specific type.

### Example of Type Narrowing
```typescript
function combine(a: number | string, b: number | string) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  }

  return `${a} ${b}`;
}
```

In this example, inside the `if` statement, TypeScript narrows the types of `a` & `b` from "either a number or a string" down to "definitely a number" - because that's what the condition of the `if` check says (and TypeScript "understands" that).

After the `if` statement, TypeScript understands that `a` and `b` are again "either a number or a string" because we only make it into the `if` statement if both are of type `number`. The type therefore is broader again.

### Adding Type Guards
You can add all kinds of "Type Guards" to run code conditionally and get TypeScript to narrow a type:

- Use JavaScript's `typeof` operator as shown above to check if you're dealing with a `string`, `number`, `boolean`, `object`, `function`, `symbol`, or `bigint` type.
- Use JavaScript's `instanceof` operator to check if an object value is based on some specific class.
- Use JavaScript's `in` operator to check if an object contains a specific property.

### Important Note
You **cannot** check if a value meets the definition of a custom type (type alias) or interface type. These are TypeScript-specific features for which no JavaScript equivalent exists. Therefore, since those `if` checks need to run at runtime, you can't write any code that would be able to check for those types at runtime.

For example, the below code won't work because the `User` type does not exist once the code is compiled to JavaScript:

```typescript
type User = {
  name: string;
  age: number;
};

type Admin = {
  name: string;
  age: number;
  permissions: string[];
};

function login(u: User | Admin) {
  if (typeof u === User) {
    // do something
  }
}
```

But you could check for the existence of the `permissions` property since only the `Admin` object will have one:

```typescript
type User = {
  name: string;
  age: number;
};

type Admin = {
  name: string;
  age: number;
  permissions: string[];
};

function login(u: User | Admin) {
  if ('permissions' in u) {
    // do something
  }
}
```

That code would work at runtime.
---

