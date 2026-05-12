# Advanced Types

Covers the parts of the TypeScript type system you reach for once basic annotations aren't enough: narrowing, conditional/mapped/template-literal types, utility types, and the operators that make all of this tractable (`keyof`, `infer`, `satisfies`, `NoInfer`).

### Useful Resources

- [TS Handbook — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TS Handbook — Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TS Handbook — Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [TS Handbook — Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [TS Handbook — Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [TS Handbook — Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

---

## Intersection Types (`&`)

Intersection of object types **combines** their properties.

```ts
type Admin = { name: string; privileges: string[] };
type Employee = { name: string; startDate: Date };

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: 'Max',
  privileges: ['create-server'],
  startDate: new Date(),
};
```

Intersection of **union** types keeps only the members the unions share:

```ts
type Combinable = string | number;
type Numeric    = number | boolean;

type Universal = Combinable & Numeric; // number
```

> Conflicting primitives intersect to `never`: `string & number` is `never`.

---

## `keyof` and Indexed Access Types

```ts
type User = { id: string; name: string; age: number };

type UserKey = keyof User;          // "id" | "name" | "age"
type UserName = User['name'];       // string
type UserField = User[keyof User];  // string | number
```

Use them together to build type-safe `get`:

```ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const u: User = { id: '1', name: 'Max', age: 30 };
const n = get(u, 'name');           // string
// get(u, 'missing');                // ❌ compile error
```

---

## Type Narrowing

### `typeof`, `instanceof`, `in`

```ts
function describe(x: string | number | Date) {
  if (typeof x === 'string') return x.toUpperCase();
  if (x instanceof Date)     return x.toISOString();
  return x.toFixed(2);  // narrowed to number
}

type Admin    = { kind: 'admin';    privileges: string[] };
type Employee = { kind: 'employee'; startDate: Date };

function printInfo(u: Admin | Employee) {
  if ('privileges' in u) console.log(u.privileges);  // Admin
  if ('startDate'  in u) console.log(u.startDate);   // Employee
}
```

### User-defined Type Predicates: `x is T`

When a check is more complex than a single operator, write a function that returns `x is T`:

```ts
type Cat = { meow: () => void };
type Dog = { bark: () => void };

function isCat(animal: Cat | Dog): animal is Cat {
  return 'meow' in animal;
}

function speak(a: Cat | Dog) {
  if (isCat(a)) a.meow();   // narrowed to Cat
  else          a.bark();
}
```

### Inferred Type Predicates (TS 5.5+)

Since TS 5.5, simple filtering functions get a predicate **automatically inferred**:

```ts
const xs: (string | null)[] = ['a', null, 'b'];

// TS 5.5 infers `(x): x is string`
const nonEmpty = xs.filter(x => x !== null);
// type: string[]  ← `null` is removed
```

**Gotcha:** truthiness checks like `Boolean` or `!!x` are **not** inferred (would be unsound — `0` is falsy but still `number`). Use an explicit `x !== null` / `x != null` instead of `.filter(Boolean)` when you want narrowing.

### Assertion Functions: `asserts x is T`

Throw if the input isn't `T`, and narrow the caller's variable afterward:

```ts
function assertIsString(x: unknown): asserts x is string {
  if (typeof x !== 'string') throw new TypeError('not a string');
}

function shout(input: unknown) {
  assertIsString(input);
  return input.toUpperCase();   // input is now `string`
}
```

A common case is exhaustiveness checking — see below.

---

## Discriminated Unions + Exhaustiveness

```ts
type Bird  = { kind: 'bird';  flyingSpeed: number };
type Horse = { kind: 'horse'; runningSpeed: number };
type Fish  = { kind: 'fish';  swimmingSpeed: number };

type Animal = Bird | Horse | Fish;

function assertNever(x: never): never {
  throw new Error('Unhandled variant: ' + JSON.stringify(x));
}

function moveAnimal(a: Animal) {
  switch (a.kind) {
    case 'bird':  return a.flyingSpeed;
    case 'horse': return a.runningSpeed;
    case 'fish':  return a.swimmingSpeed;
    default:      return assertNever(a);  // ← compile error if a new variant is added
  }
}
```

Adding `type Snake = { kind: 'snake'; slitherSpeed: number }` to `Animal` makes the `default` case **fail to compile** until you handle it. This is the canonical reason to keep a `kind` tag on union members.

---

## Type Assertions (`as`)

Use `as` to tell the compiler you know more than it does about a value:

```ts
const input = document.getElementById('user-input') as HTMLInputElement;
input.value = 'Hi there!';
```

Prefer narrowing where possible:

```ts
const el = document.getElementById('user-input');
if (el instanceof HTMLInputElement) {
  el.value = 'Hi there!';   // narrowed; no `as` needed
}
```

### Angle-bracket form (`<T>x`)

TypeScript also supports `<HTMLInputElement>el`, but **it's incompatible with `.tsx`** (clashes with JSX). Always prefer `as` for portability.

### `as const`

Locks an expression to its literal types and makes everything `readonly`:

```ts
const colors = ['red', 'green', 'blue'];          // string[]
const colorsConst = ['red', 'green', 'blue'] as const;  // readonly ["red", "green", "blue"]

type Color = typeof colorsConst[number];          // "red" | "green" | "blue"
```

### `as unknown as T` — escape hatch

If `as` complains the types are too unrelated, you can force the cast via `unknown`. **Don't do this casually** — it disables every safety net.

```ts
const x = (someValue as unknown as TargetType);
```

---

## `satisfies` (TS 4.9+)

`satisfies` checks that an expression **conforms to** a type while **keeping its narrow inferred type** for downstream use. It's the bridge between annotations (which widen) and `as` (which is unsafe).

```ts
type Palette = Record<string, string | [number, number, number]>;

const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
} satisfies Palette;

palette.green.toUpperCase();   // ✅ palette.green is still `string`
palette.red[0];                // ✅ palette.red is still tuple, not union
```

Compare to:
- `const palette: Palette = { ... }` → widens `green` to `string | [number, number, number]`, so `toUpperCase()` fails.
- `const palette = { ... } as Palette` → unsafe, silently accepts typos.

**Canonical 2025 pattern:** `as const satisfies T` — get literal inference *and* validation.

```ts
const routes = {
  home: '/',
  user: '/user/:id',
} as const satisfies Record<string, `/${string}`>;
```

---

## Conditional Types + `infer`

A conditional type is `T extends U ? X : Y`.

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<'hi'>;   // true
type B = IsString<42>;     // false
```

### `infer` — capture a type inside `extends`

Think of `infer` like a regex capture group for types:

```ts
type ElementType<T> = T extends (infer U)[] ? U : never;
type R = ElementType<number[]>;   // number

type ReturnTypeOf<F> = F extends (...a: any[]) => infer R ? R : never;
type S = ReturnTypeOf<() => string>;   // string
```

### Distribution over unions

A conditional type with a **naked** type parameter distributes over a union:

```ts
type Wrap<T> = T extends any ? T[] : never;
type W = Wrap<string | number>;   // string[] | number[]    (NOT (string|number)[])
```

To prevent distribution, wrap both sides in a tuple:

```ts
type Wrap2<T> = [T] extends [any] ? T[] : never;
type W2 = Wrap2<string | number>;   // (string | number)[]
```

---

## Mapped Types

Build a new type by iterating over keys of another type.

```ts
type ReadonlyVersion<T> = { readonly [K in keyof T]: T[K] };
type PartialVersion<T>  = { [K in keyof T]?: T[K] };
type NullableVersion<T> = { [K in keyof T]: T[K] | null };
```

### Modifiers: `+`/`-` for `?` and `readonly`

```ts
type Mutable<T>  = { -readonly [K in keyof T]: T[K] };
type Required2<T> = { [K in keyof T]-?: T[K] };
```

### Key Remapping (TS 4.1+)

`as` in a mapped type lets you rename keys:

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type U = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }
```

Filter keys by returning `never`:

```ts
type StringKeys<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
```

---

## Template Literal Types

String-level types backed by literal types:

```ts
type Greeting = `Hello, ${string}`;
type Hi = `Hello, Max`;            // assignable to Greeting

type Event = `on${Capitalize<'click' | 'hover'>}`;
// "onClick" | "onHover"
```

Built-in string manipulation types: `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, `Uncapitalize<S>`.

Combined with conditional/recursive types, you can parse strings at the type level:

```ts
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}` ? [Head, ...Split<Tail, D>] : [S];

type P = Split<'a.b.c', '.'>;   // ["a", "b", "c"]
```

---

## Built-in Utility Types — Tour

```ts
type T = { id: string; name: string; age: number };

Partial<T>      // all props optional
Required<T>     // all props required
Readonly<T>     // all props readonly
Pick<T, 'id' | 'name'>  // subset
Omit<T, 'age'>          // exclude keys

Record<'a' | 'b', number>      // { a: number; b: number }
Exclude<'a' | 'b' | 'c', 'a'>  // "b" | "c"
Extract<'a' | 'b' | 'c', 'a' | 'd'> // "a"
NonNullable<string | null | undefined> // string

type Fn = (x: number) => string;
ReturnType<Fn>     // string
Parameters<Fn>     // [x: number]

Awaited<Promise<Promise<number>>>  // number     (TS 4.5+)
NoInfer<number>                     // number     (TS 5.4+) — see below

Uppercase<'abc'>     // 'ABC'
Lowercase<'ABC'>     // 'abc'
Capitalize<'abc'>    // 'Abc'
Uncapitalize<'Abc'>  // 'abc'
```

---

## `NoInfer<T>` (TS 5.4+)

Tell TS *not* to consider a position when inferring `T`:

```ts
function createState<T>(initial: T, fallback: NoInfer<T>): T {
  return initial ?? fallback;
}

createState<'on' | 'off'>('on', 'off');   // ✅
createState<'on' | 'off'>('on', 'pause'); // ❌ – fallback can't widen T
```

Real-world uses: i18n key dictionaries, Zustand-style stores, animation `from`/`to` pairs, defaults that should not influence inference.

---

## Index Signatures

When the keys are dynamic but the value type is known:

```ts
interface ErrorBag { [field: string]: string }

const errors: ErrorBag = {
  email: 'Not a valid email',
  username: 'Must start with a character',
};
```

Index signatures accept `string`, `number`, or `symbol`. Prefer `Record<K, V>` for finite known key sets.

---

## Function Overloads

When the return type depends on the argument types:

```ts
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
  return a + b;
}

const n = add(1, 2);          // number
const s = add('hi', '!');     // string
```

The *implementation signature* (the last one) is **not callable from the outside**.

Often a generic + conditional return type is cleaner than overloads:

```ts
function id<T>(x: T): T { return x; }
```

---

## Optional Chaining & Nullish Coalescing

```ts
const user = { id: 'u1', name: 'Max', job: { title: 'CEO' } as { title: string } | undefined };

user?.job?.title;             // optional chaining – undefined if job is missing

const input: string | null | undefined = null;
const value = input ?? 'DEFAULT';   // 'DEFAULT' only when null/undefined
const value2 = input || 'DEFAULT';  // 'DEFAULT' also when '' or 0 — usually NOT what you want
```

`??` differs from `||` for falsy-but-valid values: `0 ?? 'x'` → `0`; `0 || 'x'` → `'x'`.

---

## Branded (Nominal) Types

TypeScript is structurally typed. To stop a `UserId` being passed where an `OrderId` is expected, attach an unforgeable **brand**:

```ts
type UserId  = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

const asUserId  = (s: string): UserId  => s as UserId;
const asOrderId = (s: string): OrderId => s as OrderId;

function loadUser(id: UserId) { /* … */ }

loadUser(asUserId('u_1'));   // ✅
// loadUser(asOrderId('o_1')); // ❌ argument of type 'OrderId' is not assignable to 'UserId'
```

The brand is purely a type-level fiction — it costs nothing at runtime.

---

## `unknown` at Boundaries, Not `any`

At every system boundary (`JSON.parse`, `fetch`, IPC, third-party SDKs) prefer **`unknown`** — it forces narrowing before use.

```ts
async function fetchUser(id: string): Promise<User> {
  const raw: unknown = await fetch(`/users/${id}`).then(r => r.json());
  if (!isUser(raw)) throw new Error('bad payload');
  return raw;
}

function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x && 'name' in x;
}
```

In production, prefer schema libraries (`zod`, `valibot`, `arktype`) over hand-rolled guards — they give you both runtime validation and the inferred type.

---

## Quiz (refresh)

**1. What's a "type guard"?**
A runtime check whose result the compiler trusts to narrow a variable's type inside the resulting branch.

**2. Which check ensures no runtime error?**

```ts
function size(input: string | number) {
  // a) input instanceof 'string'   ❌ instanceof only works with constructors
  // b) <string>input               ❌ a cast — never runs at runtime
  // c) typeof input === 'string'   ✅
  if (typeof input === 'string') return input.length;
  return input;
}
```

Answer: **c**.

**3. When is `as` helpful?**
When you know more about a value's type than TS can prove (DOM lookups, deserialized data). Pair with a runtime check when possible; prefer `satisfies` if you only want validation.

**4. What does `T extends U ? X : Y` do when `T` is a union?**
It distributes — TS evaluates the conditional once per union member, then unions the results. Wrap in tuples `[T] extends [U]` to suppress.

**5. When should you reach for `NoInfer<T>`?**
When you have a generic function where one parameter should *not* drive inference — e.g., a fallback/default that must match `T` but shouldn't widen it.
