# Generics

Generics let you write **type-parameterized** code — functions, classes, and types that work over many concrete types without losing type information. They're how TypeScript stays type-safe across reusable abstractions.

### Useful Resources

- [TS Handbook — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TS Handbook — Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TS 5.0 — `const` type parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters)
- [TS 4.0 — Variadic tuple types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
- [TS 4.7 — Variance annotations](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#optional-variance-annotations-for-type-parameters)

---

## Why generics?

Without generics, you either lose type information (`any`) or duplicate code per type.

```ts
function firstAny(arr: any[]): any { return arr[0]; }
const a = firstAny([1, 2, 3]);  // a: any — yuck
a.toUpperCase();                // compiles but explodes at runtime

function firstNum(arr: number[]): number { return arr[0]; }
function firstStr(arr: string[]): string { return arr[0]; } // duplication
```

Generic version captures the element type and reuses it in the return:

```ts
function first<T>(arr: T[]): T | undefined { return arr[0]; }

const n = first([1, 2, 3]);     // n: number | undefined
const s = first(['a', 'b']);    // s: string | undefined
```

You'll see the same pattern in standard library types: `Array<T>`, `Promise<T>`, `Map<K, V>`, `Set<T>`, `Record<K, V>`.

---

## Built-in generics

```ts
const names: Array<string> = ['Max', 'Manuel'];   // same as string[]
names[0].split(' ');

const p: Promise<string> = new Promise((resolve) =>
  setTimeout(() => resolve('done'), 1000)
);
p.then((data) => data.split(' ')); // data is string

const map: Map<string, number> = new Map();
map.set('a', 1);
const v = map.get('a');           // number | undefined
```

---

## Generic functions

The angle-bracket list after the function name introduces **type parameters**:

```ts
function identity<T>(x: T): T { return x; }

identity(42);     // T inferred as 42 (literal) → return type 42, widens to number in const-less contexts
identity<string>('hi');  // T set explicitly
```

Multiple type parameters:

```ts
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return Object.assign({}, a, b);
}

const m = merge({ name: 'Max' }, { age: 30 });
m.name; m.age;
```

Convention: `T`, `U`, `V` for unconstrained; descriptive names (`TItem`, `TKey`, `TError`) for public APIs.

---

## Constraints — `extends`

A constraint narrows what concrete types may substitute for a parameter.

```ts
interface Lengthy { length: number }

function describe<T extends Lengthy>(x: T): [T, string] {
  return [x, `Got ${x.length} element${x.length === 1 ? '' : 's'}.`];
}

describe('Hi there!');         // ✅ strings have .length
describe(['sport', 'cook']);   // ✅
describe(123);                 // ❌ number has no .length
```

Multiple constraints via intersection:

```ts
function tag<T extends { id: string } & { kind: string }>(x: T): T { return x; }
```

---

## `keyof` + indexed access — the type-safe property getter

```ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: '1', name: 'Max', age: 30 };
const n = get(user, 'name');     // n: string
// get(user, 'email');           // ❌ "email" is not assignable to "id" | "name" | "age"
```

Variadic version with `K extends (keyof T)[]`:

```ts
function pick<T, K extends (keyof T)[]>(obj: T, ...keys: K): Pick<T, K[number]> {
  return keys.reduce((acc, k) => ({ ...acc, [k]: obj[k] }), {} as Pick<T, K[number]>);
}

const slim = pick(user, 'id', 'name');  // { id: string; name: string }
```

---

## Default type parameters

Give a parameter a default so callers don't have to specify it:

```ts
type ApiResponse<TData = unknown, TError = Error> = {
  ok: boolean;
  data?: TData;
  error?: TError;
};

const r1: ApiResponse = { ok: false };               // TData = unknown
const r2: ApiResponse<User> = { ok: true, data: { id: '1', name: 'a', age: 1 } };
```

Defaults also work on functions and classes:

```ts
function box<T = string>(value: T): { value: T } { return { value }; }
const a = box('hi');         // { value: string }
const b = box<number>(42);   // { value: number }
```

---

## `const` type parameters (TS 5.0)

By default, TS *widens* literals at inference sites. `<const T>` preserves them — equivalent to the caller writing `as const`.

```ts
function pickKeys<T extends readonly string[]>(keys: T): T { return keys; }
const k1 = pickKeys(['a', 'b']);        // string[]

function pickKeysConst<const T extends readonly string[]>(keys: T): T { return keys; }
const k2 = pickKeysConst(['a', 'b']);   // readonly ["a", "b"]   ← exact literals preserved
```

Useful for: routing DSLs, form builders, state-machine configs, anywhere the **caller's literal values must reach the type level**.

---

## Variadic tuple types (TS 4.0+)

Type parameters can bind to tuple shapes, including rest segments:

```ts
function callIt<T extends unknown[], R>(fn: (...args: T) => R, ...args: T): R {
  return fn(...args);
}

callIt((a: number, b: string) => `${a}-${b}`, 1, 'x'); // R = string

// Concatenate two tuples
type Concat<A extends readonly unknown[], B extends readonly unknown[]> = [...A, ...B];
type C = Concat<[1, 2], [3, 4]>;   // [1, 2, 3, 4]

// Labels in tuples (TS 4.0; mix allowed since 5.2)
type Range = [start: number, end: number];
```

This is what makes `Awaited<T>`, `Parameters<F>`, `ConstructorParameters<F>`, `OmitThisParameter<F>` work.

---

## Generic classes

```ts
class DataStorage<T extends string | number | boolean> {
  private data: T[] = [];

  add(item: T) { this.data.push(item); }
  remove(item: T) {
    const i = this.data.indexOf(item);
    if (i >= 0) this.data.splice(i, 1);
  }
  list(): readonly T[] { return [...this.data]; }
}

const text = new DataStorage<string>();
text.add('Max'); text.add('Manu'); text.remove('Manu');
```

> The constraint `T extends string | number | boolean` matters because `indexOf` uses **reference equality** — passing object types would silently fail to find an "equal-by-value" entry. For objects, change the design (store keyed by id, or pass a custom equality function).

Generic interface:

```ts
interface Repository<T extends { id: string }> {
  find(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
```

---

## Generic Types vs Union Types

Use a **union** when a variable can hold *any one of a known set of types* across its lifetime. Use a **generic** when the type is *fixed per usage* but varies between usages.

```ts
// Union — `x` could be string OR number on any given call. The function
// has to handle both branches.
function describeUnion(x: string | number) {
  return typeof x === 'string' ? x.toUpperCase() : x.toFixed(2);
}

// Generic — each call locks in a specific T. The function returns the
// exact same type the caller passed.
function describeGeneric<T>(x: T): T { return x; }

const a: string = describeGeneric('hi');   // T = string for this call
const b: number = describeGeneric(42);     // T = number for this call
```

Rule of thumb: if you'd say "this returns whatever you passed in," that's a generic.
If you'd say "this accepts one of these *known* shapes and handles each differently," that's a union.

---

## `NoInfer<T>` (TS 5.4)

When you want one parameter position to **not** influence inference of `T`:

```ts
function createState<T>(initial: T, fallback: NoInfer<T>): T {
  return initial ?? fallback;
}

createState<'on' | 'off'>('on', 'off');    // ✅
// createState<'on' | 'off'>('on', 'pause'); // ❌
```

See [Advanced Types — `NoInfer`](../4.Advanced%20Types/README4.md#noinfert-ts-54) for more context.

---

## Variance annotations: `in T`, `out T`, `in out T` (TS 4.7)

Most code never needs these — TS infers variance from how a parameter is used. Reach for explicit annotations when:
- You ship a library with **many** generic types that get compared frequently (e.g. RxJS-style `Observable<T>`) and want to **speed up structural checks**.
- You have *empty* generic types that compare too loosely without an annotation.

```ts
interface Producer<out T> { produce(): T; }       // covariant: Producer<Dog> → Producer<Animal>
interface Consumer<in T>  { consume(x: T): void; } // contravariant: Consumer<Animal> → Consumer<Dog>
interface Processor<in out T> { run(x: T): T; }    // invariant
```

---

## Working with utility types

A short tour — see [Advanced Types — Utility Types Tour](../4.Advanced%20Types/README4.md#built-in-utility-types--tour) for the full list.

```ts
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

// Build incrementally — Partial<T> makes every prop optional.
function createCourseGoal(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  const draft: Partial<CourseGoal> = {};
  draft.title = title;
  draft.description = description;
  draft.completeUntil = date;
  return draft as CourseGoal;
}

// Readonly<T> — block mutation.
const names: Readonly<string[]> = ['Max', 'Anna'];
// names.push('Manu');   // ❌ Property 'push' does not exist on type 'readonly string[]'.

// Awaited<T> — unwrap nested promises (TS 4.5+).
type R = Awaited<Promise<Promise<number>>>;   // number
```

---

## Patterns you'll reach for

### 1. Type-safe `pluck`

```ts
function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map((x) => x[key]);
}

const ages = pluck([{ name: 'a', age: 1 }, { name: 'b', age: 2 }], 'age');
// ages: number[]
```

### 2. Generic factory

```ts
function factory<T extends new (...a: any[]) => any>(Ctor: T) {
  return (...args: ConstructorParameters<T>): InstanceType<T> => new Ctor(...args);
}

class User { constructor(public name: string, public age: number) {} }
const makeUser = factory(User);
const u = makeUser('Max', 30);   // u: User
```

### 3. Builder

```ts
class QueryBuilder<T = {}> {
  private state = {} as T;

  set<K extends string, V>(key: K, value: V): QueryBuilder<T & Record<K, V>> {
    (this.state as any)[key] = value;
    return this as unknown as QueryBuilder<T & Record<K, V>>;
  }

  build(): T { return this.state; }
}

const q = new QueryBuilder()
  .set('limit', 10)
  .set('order', 'asc')
  .build();   // { limit: number; order: string }
```

### 4. Discriminated container

```ts
type Result<T, E = Error> =
  | { ok: true;  value: T }
  | { ok: false; error: E };

function tryParse<T>(input: string, parse: (s: string) => T): Result<T> {
  try { return { ok: true, value: parse(input) }; }
  catch (e) { return { ok: false, error: e instanceof Error ? e : new Error(String(e)) }; }
}
```

---

## Gotchas

- **Inference can't read your mind for unused parameters.** If `T` only appears in the *return type*, callers will have to specify it explicitly: `parse<User>('…')`.
- **Generic constraints flow at call sites, not at declaration.** `<T extends string>` doesn't mean "T is one of `'a' | 'b'`"; the caller supplies what to substitute.
- **`as` casts are not generic constraints.** `value as T` doesn't validate anything at runtime — pair with a guard.
- **Don't over-parameterize.** If only one concrete type is ever used, drop the generic.

---

## Quiz

**1. When do generics help most?**
When the same code shape works for many types but you want the caller's concrete type to flow through (e.g., a container, a factory, a function whose return type depends on its argument).

**2. Does this make sense?**
```ts
const data = extractData<string>(user, 'userId');
```
Yes — when the function has no way to infer `T` from its arguments (e.g., it returns parsed JSON), letting the caller specify `T` is the standard idiom.

**3. What are constraints for?**
To say "T can be anything that has these capabilities" — typically structural shape (`T extends { id: string }`) or a key set (`K extends keyof T`).

**4. Why use `<const T>` instead of `<T>`?**
To preserve the caller's literal types instead of widening (`['a','b']` stays `readonly ['a','b']` instead of becoming `string[]`).

**5. When should you reach for `NoInfer<T>`?**
When one parameter shouldn't drive inference — typically a fallback/default that must match `T` but mustn't widen it.
