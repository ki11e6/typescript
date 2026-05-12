# TypeScript Interview Preparation Guide

> Targeted at **TypeScript 5.x** (covers 5.0 → 5.7+ changes). Sections progress from **Junior → Mid → Senior → Staff/Architect**.
> Each section has **Theory**, **Quick Q&A**, **Coding Questions with Multiple Solutions**, and **Gotchas**.

---

## Table of Contents

1. [Junior Level](#junior-level)
2. [Mid Level](#mid-level)
3. [Senior Level](#senior-level)
4. [Staff / Architect Level](#staff--architect-level)
5. [TypeScript 5.x Latest Features (must know)](#typescript-5x-latest-features-must-know)
6. [Common Gotchas & Trick Questions](#common-gotchas--trick-questions)
7. [Coding Patterns Cheat Sheet](#coding-patterns-cheat-sheet)

---

# Junior Level

## Theory

### 1. What is TypeScript? Why use it over JavaScript?
- **TypeScript** is a strongly-typed **superset of JavaScript** that compiles to plain JS.
- Adds: static types, interfaces, generics, enums, access modifiers, decorators.
- Benefits: catch errors at compile time, better IDE intellisense, self-documenting code, safer refactoring.
- Drawbacks: build step, learning curve, sometimes verbose.

### 2. Primitive types
```ts
let s: string = "hi";
let n: number = 42;       // both int and float
let b: boolean = true;
let u: undefined = undefined;
let nl: null = null;
let big: bigint = 100n;
let sym: symbol = Symbol("k");
```

### 3. `any` vs `unknown` vs `never` vs `void`
| Type | Meaning | Use case |
|------|---------|----------|
| `any` | Disables type checking | Avoid — escape hatch |
| `unknown` | Top type, must narrow before use | Safe replacement for `any` |
| `never` | Bottom type, no value possible | Exhaustive checks, functions that throw |
| `void` | Function returns nothing meaningful | Callback return type |

### 4. Type inference
TS infers types from initialization, return values, and contextual typing.
```ts
let x = 10;            // inferred number
const arr = [1, 2, 3]; // number[]
```

### 5. Type vs Interface
| Feature | `type` | `interface` |
|--------|--------|-------------|
| Object shape | ✅ | ✅ |
| Union | ✅ | ❌ |
| Declaration merging | ❌ | ✅ |
| Extend | `&` | `extends` |
| Computed properties | ✅ | limited |

**Rule of thumb:** prefer `interface` for public object APIs (extensible via declaration merging), `type` for unions/intersections/utility compositions.

---

## Quick Q&A (Junior)

**Q: What's the difference between `let` and `const` in TS?**
A: Same as JS at runtime. But TS infers `const` literals as their **literal type** (`const x = "a"` → `"a"`) while `let` widens to base (`let x = "a"` → `string`).

**Q: What is a tuple?**
A: Fixed-length, fixed-type array. `let t: [string, number] = ["a", 1];`

**Q: What does `readonly` do?**
A: Prevents reassignment of a property. `readonly` arrays/tuples block `push`/`pop`/index assignment.

**Q: How do you type a function?**
```ts
// 1. Inline
function add(a: number, b: number): number { return a + b; }

// 2. Type alias
type Add = (a: number, b: number) => number;

// 3. Interface
interface IAdd { (a: number, b: number): number; }

// 4. Arrow
const add: Add = (a, b) => a + b;
```

**Q: Optional vs default vs union with `undefined`?**
```ts
function f(a?: number) {}                 // optional, a: number | undefined
function f(a: number = 0) {}              // default
function f(a: number | undefined) {}      // required, must explicitly pass
```

---

## Coding Q1: Reverse a string with strong typing
**Multiple solutions:**

```ts
// 1. Built-in
const reverse = (s: string): string => s.split("").reverse().join("");

// 2. for loop
const reverse2 = (s: string): string => {
  let out = "";
  for (let i = s.length - 1; i >= 0; i--) out += s[i];
  return out;
};

// 3. Recursion
const reverse3 = (s: string): string =>
  s.length <= 1 ? s : reverse3(s.slice(1)) + s[0];

// 4. Type-level reverse (TS 4.1+ template literals) — interview gold
type Reverse<S extends string> =
  S extends `${infer H}${infer T}` ? `${Reverse<T>}${H}` : S;

type R = Reverse<"hello">; // "olleh"
```

---

## Coding Q2: Type a function that filters truthy values
```ts
// 1. Naive
function truthy<T>(arr: T[]): T[] { return arr.filter(Boolean); }

// 2. With type predicate — removes null/undefined from the type
function truthy2<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((x): x is T => x != null);
}

// Usage
const xs: (string | null)[] = ["a", null, "b"];
const ys = truthy2(xs); // string[]  ← null gone from type
```

---

# Mid Level

## Theory

### 1. Generics
Parametric polymorphism — write reusable code that works over many types.
```ts
function identity<T>(x: T): T { return x; }
class Box<T> { constructor(public value: T) {} }
```

**Constraints:** `<T extends { id: string }>`
**Defaults:** `<T = string>`
**Multiple:** `<K extends keyof T, T>`

### 2. Union & Intersection
```ts
type A = { a: string }; type B = { b: number };
type U = A | B;  // either
type I = A & B;  // both — { a: string; b: number }
```

### 3. Type Narrowing
- `typeof` guard: primitives.
- `instanceof` guard: classes.
- `in` guard: property presence.
- Equality narrowing: `===`, `!==`.
- Discriminated unions.
- User-defined type predicates: `x is Foo`.
- TS 5.5+ **inferred type predicates** — narrowing functions auto-inferred.

### 4. Discriminated Unions (Tagged Unions)
```ts
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; side: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.r ** 2;
    case "square": return s.side ** 2;
    default: { const _exhaustive: never = s; return _exhaustive; }
  }
}
```

### 5. Utility Types (built-in)
| Utility | Purpose |
|--------|---------|
| `Partial<T>` | All props optional |
| `Required<T>` | All props required |
| `Readonly<T>` | All props readonly |
| `Pick<T, K>` | Select keys |
| `Omit<T, K>` | Exclude keys |
| `Record<K, V>` | Object map |
| `Exclude<U, X>` | Remove from union |
| `Extract<U, X>` | Keep from union |
| `NonNullable<T>` | Remove null/undefined |
| `ReturnType<F>` | Function return type |
| `Parameters<F>` | Function params tuple |
| `Awaited<T>` | Unwrap Promise (TS 4.5+) |
| `NoInfer<T>` (TS 5.4+) | Block inference at position |

### 6. `keyof`, `typeof`, indexed access
```ts
const obj = { a: 1, b: "x" };
type Keys = keyof typeof obj;      // "a" | "b"
type AVal = (typeof obj)["a"];     // number
```

### 7. Mapped Types
```ts
type Nullable<T> = { [K in keyof T]: T[K] | null };
type Stringify<T> = { [K in keyof T]: string };

// Key remapping (TS 4.1+)
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
```

### 8. Conditional Types
```ts
type IsString<T> = T extends string ? true : false;
type ElementType<T> = T extends (infer U)[] ? U : never;
```

---

## Quick Q&A (Mid)

**Q: What is `infer`?**
A: A keyword used inside a conditional type's `extends` clause to capture a type. Like a regex capture group for the type system.

**Q: Why does `T extends U ? A : B` distribute over unions?**
A: When `T` is a **naked type parameter** and a union, TS evaluates the conditional once per union member, then re-unions the results. Wrap in tuple `[T] extends [U]` to prevent.

**Q: `interface A extends B` vs `type A = B & {...}`?**
A: `extends` is an early error if conflicts; intersection silently produces `never` for conflicting primitives.

**Q: What is structural typing?**
A: TS compares types by **shape**, not by name (unlike nominal typing in Java/C#). Two objects with the same shape are assignment-compatible.

**Q: How do you brand a type for nominal typing?**
```ts
type UserId = string & { __brand: "UserId" };
type OrderId = string & { __brand: "OrderId" };
// Can't pass a UserId where OrderId is expected.
```

**Q: What's the difference between `as const` and `Readonly<T>`?**
A: `as const` makes literal types & deeply readonly + narrows values. `Readonly<T>` only marks top-level properties readonly, does not narrow values.

---

## Coding Q3: Implement `DeepPartial<T>`
```ts
// 1. Basic — handles objects only
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// 2. Handle arrays, tuples, functions
type DeepPartial2<T> =
  T extends (...a: any[]) => any ? T :
  T extends readonly (infer U)[] ? readonly DeepPartial2<U>[] :
  T extends object ? { [K in keyof T]?: DeepPartial2<T[K]> } :
  T;

// 3. Stop at Date/Map/Set
type Primitive = string | number | boolean | bigint | symbol | null | undefined;
type Builtin = Primitive | Date | Map<any, any> | Set<any> | RegExp;
type DeepPartial3<T> =
  T extends Builtin ? T :
  T extends (...a: any[]) => any ? T :
  T extends readonly (infer U)[] ? readonly DeepPartial3<U>[] :
  { [K in keyof T]?: DeepPartial3<T[K]> };
```

---

## Coding Q4: Type-safe `pick` function
```ts
// 1. Standard
function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const k of keys) out[k] = obj[k];
  return out;
}

// 2. Using reduce
const pick2 = <T extends object, K extends keyof T>(o: T, ks: K[]): Pick<T, K> =>
  ks.reduce((acc, k) => ({ ...acc, [k]: o[k] }), {} as Pick<T, K>);

// 3. Variadic — strings as rest args (TS 4.0+)
function pick3<T extends object, K extends (keyof T)[]>(
  o: T, ...ks: K
): Pick<T, K[number]> {
  return ks.reduce((a, k) => ({ ...a, [k]: o[k] }), {} as Pick<T, K[number]>);
}
```

---

## Coding Q5: Implement `Awaited<T>` from scratch
```ts
type MyAwaited<T> =
  T extends null | undefined ? T :
  T extends object & { then(onfulfilled: infer F, ...args: any): any }
    ? F extends ((value: infer V, ...a: any) => any)
      ? MyAwaited<V>
      : never
    : T;

type A = MyAwaited<Promise<Promise<string>>>; // string
```

---

# Senior Level

## Theory

### 1. Variance: covariance, contravariance, bivariance
- **Covariant**: `T` flows in same direction (return types).
- **Contravariant**: `T` flows opposite (function parameters).
- TS function parameters are **bivariant by default**; `strictFunctionTypes` makes them contravariant — **but with an important carve-out**: parameters declared with **method shorthand** (`foo(x: T): void`) stay bivariant; only the **property/arrow form** (`foo: (x: T) => void`) becomes contravariant. This was deliberate to keep DOM/lib types ergonomic (intro'd in TS 2.6).
- TS 4.7+ introduced **explicit variance annotations**: `in T`, `out T`, `in out T`.

```ts
interface Producer<out T> { produce(): T; }       // covariant
interface Consumer<in T>  { consume(x: T): void; } // contravariant

// Bivariance carve-out under strictFunctionTypes:
interface A { f(x: Animal): void; }   // method  → bivariant
interface B { f: (x: Animal) => void; } // property → contravariant
```

### 2. Template Literal Types
```ts
type Event = `${"on"}${Capitalize<"click" | "hover">}`;
// "onClick" | "onHover"

type Split<S extends string, D extends string> =
  S extends `${infer H}${D}${infer T}` ? [H, ...Split<T, D>] : [S];
```

### 3. Recursive Conditional Types & Tail-Recursion
TS 4.5 added tail-recursion elimination for conditionals — allows deeper recursion before hitting "Type instantiation excessively deep."

### 4. `satisfies` operator (TS 4.9+)
Validates an expression matches a type **without** widening / narrowing the inferred type.
```ts
const config = {
  host: "localhost",
  port: 5432,
} satisfies { host: string; port: number };

config.host.toUpperCase(); // OK — still inferred narrowly
```

### 5. `const` type parameters (TS 5.0+)
```ts
function pick<const T extends readonly string[]>(keys: T): T { return keys; }
const r = pick(["a", "b"]); // type: readonly ["a", "b"]   (was just string[])
```

### 6. Decorators (TS 5.0 Stage-3 / ECMAScript Decorators)
TS 5.0 implements the new Stage-3 decorators proposal (different from old experimental).
```ts
function logged<T extends (this: any, ...a: any[]) => any>(
  value: T,
  ctx: ClassMethodDecoratorContext,
): T {
  return function (this: unknown, ...args: any[]) {
    console.log(`enter ${String(ctx.name)}`);
    const r = value.apply(this, args);
    console.log(`exit ${String(ctx.name)}`);
    return r;
  } as T;
}

class S { @logged greet(n: string) { return `hi ${n}`; } }
```
Old experimental decorators still available via `experimentalDecorators: true`.

### 7. Module systems & `moduleResolution`
- `node` (legacy, CommonJS)
- `node16` / `nodenext` — respects package.json `exports`, `type: "module"`
- `bundler` (TS 5.0+) — for Vite/Webpack/esbuild bundlers; loose like `bundler` does
- `classic` — never use

### 8. Project references & composite builds
Split a monorepo into smaller TS projects with `references`, `composite: true`, `tsc -b` (build mode). Faster incremental builds.

### 9. Strict mode breakdown (as of TS 5.6+)
`strict: true` enables: `alwaysStrict`, `noImplicitAny`, `noImplicitThis`, `strictBindCallApply`, `strictBuiltinIteratorReturn` (5.6+), `strictFunctionTypes`, `strictNullChecks`, `strictPropertyInitialization`, `useUnknownInCatchVariables` (4.4+). The set grows over time — always check the **TSConfig reference** for the version you're on.

### 10. Declaration merging
```ts
interface Window { myApp: { version: string }; }   // augments lib.dom
declare module "express" { interface Request { user?: User; } }
```

---

## Quick Q&A (Senior)

**Q: When would `extends` produce `never`?**
A: When the union members fully filter out in a distributive conditional. Also when intersecting incompatible primitives: `string & number` → `never`.

**Q: `unknown` in catch — how to handle?**
```ts
try { /* ... */ } catch (e) {
  if (e instanceof Error) console.log(e.message);
  else if (typeof e === "string") console.log(e);
  else console.log(String(e));
}
```

**Q: Difference between `Object`, `object`, `{}`?**
- `object` (lowercase) — any **non-primitive** value (function, array, object). Excludes `string`/`number`/`boolean`/etc.
- `{}` — **any non-nullish** value. Note: primitives like `"hi"`, `42`, `true` ARE assignable to `{}` because they auto-box; only `null` and `undefined` are excluded. It's not literally "an empty object."
- `Object` — roughly the same accepted set as `{}` (any non-null/undefined), but also declares prototype methods (`toString`, `valueOf`, `hasOwnProperty`). Discouraged by official "Do's and Don'ts" — prefer `unknown` for "I don't know" and `object` for "non-primitive."

**Q: Why does `Array<T>.indexOf` accept any value?**
A: Historical JS contract. Use `as const` arrays + `includes` with narrowed type via custom typing.

**Q: What does `assert` style function do?**
```ts
function assertIsString(x: unknown): asserts x is string {
  if (typeof x !== "string") throw new Error("not string");
}
// After call, x is narrowed to string.
```

---

## Coding Q6: Implement `Get<T, Path>` (lodash get) at type-level
```ts
type Get<T, P extends string> =
  P extends `${infer K}.${infer R}`
    ? K extends keyof T ? Get<T[K], R> : never
    : P extends keyof T ? T[P] : never;

type T = { a: { b: { c: number } } };
type V = Get<T, "a.b.c">; // number
```

Implementation:
```ts
// 1. Recursive
function get<T, P extends string>(o: T, path: P): Get<T, P> {
  return path.split(".").reduce<any>((acc, k) => acc?.[k], o);
}

// 2. With default
function getOr<T, P extends string, D>(o: T, path: P, fallback: D): Get<T, P> | D {
  const v = path.split(".").reduce<any>((acc, k) => acc?.[k], o);
  return v === undefined ? fallback : v;
}
```

---

## Coding Q7: Type-safe event emitter
```ts
type Events = {
  login: { userId: string };
  logout: void;
  error: { code: number; msg: string };
};

class Emitter<E extends Record<string, any>> {
  private listeners: { [K in keyof E]?: ((p: E[K]) => void)[] } = {};

  on<K extends keyof E>(ev: K, cb: (p: E[K]) => void) {
    (this.listeners[ev] ??= []).push(cb);
  }

  emit<K extends keyof E>(ev: K, ...args: E[K] extends void ? [] : [E[K]]) {
    this.listeners[ev]?.forEach(fn => fn(args[0] as E[K]));
  }
}

const e = new Emitter<Events>();
e.on("login", p => p.userId);   // typed
e.emit("logout");                // no payload required
e.emit("login", { userId: "1" });
```

**Alternative**: use an `EventTarget`-style API with overload signatures instead of mapped types.

---

## Coding Q8: Implement `Zip<A, B>` at the type level
```ts
type Zip<A extends any[], B extends any[]> =
  A extends [infer A1, ...infer ARest]
    ? B extends [infer B1, ...infer BRest]
      ? [[A1, B1], ...Zip<ARest, BRest>]
      : []
    : [];

type Z = Zip<[1, 2, 3], ["a", "b", "c"]>; // [[1,"a"],[2,"b"],[3,"c"]]
```

---

## Coding Q9: Builder pattern with progressive typing
```ts
type Builder<T, Set extends keyof T = never> = {
  [K in Exclude<keyof T, Set>]-?:
    (v: T[K]) => Builder<T, Set | K>
} & ([Exclude<keyof T, Set>] extends [never] ? { build(): T } : {});

declare function builder<T>(): Builder<T>;

interface User { id: string; name: string; age: number; }
const u = builder<User>()
  .id("1")
  .name("a")
  .age(30)
  .build();  // only allowed when all fields set
```

---

# Staff / Architect Level

## Theory

### 1. Why TypeScript types are **erased** at runtime — and consequences
- TS types vanish post-compile. Cannot reflect over them.
- Workarounds: emit metadata via decorators (`emitDecoratorMetadata`), use schema libs (`zod`, `valibot`, `arktype`), code-generation from types (`ts-morph`, `ts-to-zod`).

### 2. Designing public type APIs
- Prefer `interface` for extensibility (declaration merging).
- Make generic params **distributive** carefully.
- Provide **branded** primitive types for IDs.
- Use `satisfies` over annotations in consumers' code to preserve narrow inference.
- Avoid `any` in public types — it virally infects consumers.

### 3. Performance: compiler & language service
- **Causes of slow builds:** deep recursive types, large unions, `extends` chains in hot paths, declaration emit, project size.
- **Mitigations:** `incremental: true`, project references, `skipLibCheck`, isolate slow generics into named types (TS caches them), avoid mapped-conditional combos when avoidable, prefer `interface` over big type intersections (faster check).
- TS 5.6+ has incremental check perf improvements; TS 5.7+ has `--noUncheckedSideEffectImports`.

### 4. Type-level computation limits
- TS imposes ~50-deep recursion (raised in 4.5 tail-call); ~100k instantiations.
- Avoid building Turing-complete machinery into hot module types — push to runtime.

### 5. Schema-first vs Type-first
- **Type-first:** `zod`/`valibot` infers TS types from runtime schema → single source of truth.
- **Type-first OpenAPI/GraphQL:** generate TS types from schema.
- Discuss tradeoffs: runtime validation cost, drift risk, DX.

### 6. Monorepo strategy
- Project references with `tsc -b`.
- `paths` mapping vs workspace symlinks — bundler-native vs TS-native.
- Composite builds; isolated modules for ESM bundlers.

### 7. Migration: JS → TS strategies
1. `allowJs: true` + `checkJs: false` → adopt incrementally.
2. JSDoc typing → no transpile needed.
3. Rename file-by-file; start with leaf modules.
4. Use `// @ts-expect-error` for known gaps; CI fail when missing.
5. Tighten `strict` flags gradually: `noImplicitAny` → `strictNullChecks` → full `strict`.

### 8. Working with third-party untyped libs
- Local `*.d.ts` with `declare module "foo";` (any).
- Check `@types/...`.
- Generate ambient declarations with `dts-gen`.

---

## Senior/Staff Coding Q10: Express a JSON-only type
```ts
type Json =
  | string | number | boolean | null
  | Json[]
  | { [k: string]: Json };

function send<T extends Json>(payload: T): void { /* ... */ }
```

## Senior/Staff Coding Q11: Compile-time SQL field validation
```ts
type ValidColumn<T, K extends string> =
  K extends keyof T ? K : `Error: '${K}' is not a column of ${string}`;

function select<T, K extends string>(
  table: T, ...cols: { [I in keyof [K]]: ValidColumn<T, K> }
): void {}
```

## Senior/Staff Coding Q12: Path autocomplete with template literals
```ts
type Paths<T, P extends string = ""> = T extends object
  ? { [K in keyof T & string]:
      | `${P}${P extends "" ? "" : "."}${K}`
      | Paths<T[K], `${P}${P extends "" ? "" : "."}${K}`>
    }[keyof T & string]
  : never;

type User = { name: string; address: { city: string; zip: string } };
type P = Paths<User>; // "name" | "address" | "address.city" | "address.zip"
```

---

# TypeScript 5.x Latest Features (must know)

## 5.0 (March 2023)
- **Stage-3 Decorators** (no `experimentalDecorators` flag). Not compatible with `--emitDecoratorMetadata`; cannot decorate parameters.
- **`const` type parameters**: `<const T>` preserves literal types from call sites — like applying `as const` at the call site automatically.
- **`tsconfig.json` `extends` accepts an array** of config files.
- **All enums are union enums** — each member gets its own type (including computed members), so members can be referenced/narrowed as types. (Correctness/expressiveness, not just perf.)
- **`--moduleResolution bundler`** — models Vite/esbuild/webpack/parcel resolution; consults `package.json` `exports`/`imports`; allows extensionless imports.
- **`--verbatimModuleSyntax`** replaces `importsNotUsedAsValues` + `preserveValueImports`. Imports/exports without `type` modifier are preserved verbatim; anything with `type` is erased.

## 5.1
- Easier implicit returns for `undefined`-returning functions. Functions annotated `(): undefined` no longer need an explicit `return`.
- Unrelated types allowed for getters/setters on the same property (e.g., `get` returns `CSSStyleDeclaration`, `set` accepts `string`) — with explicit annotations.
- **`JSX.ElementType`** decouples JSX element typing from JSX tag types — enables components returning `Promise<Element>`.
- Namespaced JSX attributes (`<el a:b="x" />`).

## 5.2
- **`using` declarations** (explicit resource management — Symbol.dispose). Also `await using`, `Symbol.asyncDispose`, `Disposable` / `AsyncDisposable`, `DisposableStack`.
  ```ts
  {
    using file = openFile();  // auto-disposed at scope end
  }
  ```
- **Decorator metadata** (Stage-3) — `context.metadata` + `Symbol.metadata` so decorators can attach/read metadata.
- **Tuples can mix labeled and unlabeled elements**, e.g. `[first: T, T]` is now allowed. (Labels themselves existed since TS 4.0; this only removed the all-or-nothing restriction.)

## 5.3
- **Import attributes** (`import json from "./d.json" with { type: "json" }`) — replaces the older `assert` syntax.
- **`instanceof` narrowing via `Symbol.hasInstance`** — when a class declares `[Symbol.hasInstance](v): v is X` as a type predicate, `instanceof` narrows accordingly.
- **`switch (true)` narrowing** — case branches `case predicate:` now narrow correctly.
- Narrowing on `=== true` / `=== false` boolean comparisons.
- `resolution-mode` stabilized for import types across all `moduleResolution` modes.

## 5.4
- **`NoInfer<T>`** utility — prevents inference at certain positions.
  ```ts
  function f<T>(x: T, y: NoInfer<T>) {}
  f("a", "b"); // y can't influence T
  ```
- Preserved narrowing in closures after the last assignment.
- `Object.groupBy`, `Map.groupBy` types.

## 5.5
- **Inferred type predicates** — functions that filter are auto-inferred as predicates.
  ```ts
  const isStr = (x: unknown) => typeof x === "string";
  // TS 5.5: inferred as `(x: unknown) => x is string`
  ```
- Regular expression syntactic checking.
- Control flow narrowing for constant indexed accesses.
- Isolated declarations.

## 5.6
- **Disallowed nullish/truthy checks** that are always true/false (e.g. `if (() => x)` — bare function reference always truthy).
- **Iterator helper methods** typings (`map`, `filter`, `take`, `drop`, `flatMap`, `toArray`, ...) — ES2024.
- **`--strictBuiltinIteratorReturn`** + new `BuiltinIteratorReturn` type (under `strict`).
- **`--noUncheckedSideEffectImports`** — errors on `import "./missing"` when the path can't be resolved (side-effect imports were previously silently ignored).

## 5.7
- **`--rewriteRelativeImportExtensions`** — rewrite `.ts` import extensions to `.js` at emit time.
- **Checks for never-initialized variables** — catches `let` used before assignment, even in nested closures.
- **TypedArrays generic over `ArrayBufferLike`** — `Uint8Array<ArrayBuffer>` vs `Uint8Array<SharedArrayBuffer>`, part of ES2024 alignment.
- Faster project loads (V8 compile caching ≈ 2.5× faster CLI startup); faster project ownership in composite builds.

## 5.8
- Granular checks for branches in return expressions.
- Path rewriting for relative paths (`--module nodenext` stabilizations).
- `--erasableSyntaxOnly` for Node.js `--experimental-strip-types` compatibility — disallows runtime TS features (enums, namespaces with values, parameter properties).
- `--libReplacement` to swap built-in `lib.*.d.ts` files.

## 5.9 (latest stable as of May 2026)
- **`import defer`** support — deferred module evaluation (ES proposal).
- Updated `tsc --init` defaults — minimal, modern starter `tsconfig.json` (drops verbose comments, enables `strict`, `esModuleInterop`, etc.).
- Expandable hovers / configurable hover length in the language service.
- Further performance and memory work.

### Separate effort: native (Go) TypeScript port
Microsoft is building a **Go-based native TypeScript compiler/LSP** ("a 10× faster TypeScript") tracked separately from the 5.x line. Not a 5.x release — expected to become the basis of a future major (sometimes discussed as the path toward TypeScript 6/7).

> **Tip for interview**: knowing **`satisfies`**, **`const` generics**, **`using`**, **`NoInfer`**, **decorators v2**, **inferred type predicates**, and the **native port effort** demonstrates you're current.

---

# Common Gotchas & Trick Questions

### G1. Why does this not narrow?
```ts
function f(x: string | undefined) {
  if (x !== undefined) {
    setTimeout(() => x.toUpperCase()); // ❌ Object is possibly undefined
  }
}
```
**Why:** TS conservatively widens captured variables in closures (in case reassigned). Use a `const` local: `const v = x; setTimeout(() => v.toUpperCase());` — TS 5.4 improves this for non-reassigned vars.

### G2. Index signatures vs `Record`
```ts
type A = { [k: string]: number };
type B = Record<string, number>;
```
Largely interchangeable, but **mapped types** can constrain keys finitely: `Record<"a"|"b", number>`. Index signatures cannot have unions of literal keys cleanly.

### G3. `{}` ≠ empty object
`{}` means "any non-nullish". Use `Record<string, never>` for truly empty.

### G4. Distribution surprise
```ts
type Wrap<T> = T extends any ? T[] : never;
type R = Wrap<string | number>; // string[] | number[]   (not (string|number)[])
```
Use `[T] extends [any]` to suppress.

### G5. Excess property checks only on object literals
```ts
type A = { x: number };
const a: A = { x: 1, y: 2 };   // ❌ excess
const obj = { x: 1, y: 2 };
const b: A = obj;              // ✅ no excess check on var
```

### G6. `enum` pitfalls
- Numeric enums are bidirectional (`E[0] === "A"`); string enums are **not** (no reverse mapping).
- **Ambient `const enum`s** (declared in `.d.ts` files and imported across modules) are incompatible with `--isolatedModules`/Babel/SWC because they require cross-file inlining at TS-compile time. Local `const enum`s inside your own project work; using `--preserveConstEnums` (or just regular enums) is the safest cross-toolchain path.
- Prefer **`as const` object** + union type, or **string enums**, when in doubt.
```ts
const Role = { Admin: "admin", User: "user" } as const;
type Role = (typeof Role)[keyof typeof Role]; // "admin" | "user"
```

### G7. `Promise<void>` returning function
```ts
const cb: () => void = async () => { await x(); };  // ✅ allowed
const cb2: () => undefined = async () => { /* err */ };
```
`void` return is lax — any return value allowed (ignored). Be careful with `forEach`/Promise mix.

### G8. `keyof` of an interface with index signature
```ts
interface A { [k: string]: number; foo: number; }
type K = keyof A; // string | number   (NOT "foo")
```

### G9. `Function` type
Avoid; it's untyped. Use `(...args: any[]) => any` or be specific.

### G10. `as` is a cast, not a type-check
`x as Foo` doesn't verify at runtime. For runtime checks, use zod/io-ts or type guards.

---

# Coding Patterns Cheat Sheet

## Type-safe deep clone signature
```ts
function clone<T>(x: T): T {
  return structuredClone(x); // runtime: structured clone algo
}
```

## Exhaustive switch helper
```ts
function assertNever(x: never, msg = "unexpected"): never { throw new Error(msg); }
```

## Strict object key iteration
```ts
function keysOf<T extends object>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[];
}
```
(Note: structurally unsound — extra keys at runtime. Pragmatic.)

## Function overloads
```ts
function fmt(x: number): string;
function fmt(x: Date): string;
function fmt(x: number | Date): string {
  return x instanceof Date ? x.toISOString() : x.toFixed(2);
}
```

## Generic constraint with conditional default
```ts
function api<T, R = T extends { transform: (x: T) => infer U } ? U : T>(
  input: T,
): R { /* ... */ return null as R; }
```

## Type-safe `Object.fromEntries`
```ts
function fromEntries<K extends PropertyKey, V>(
  entries: readonly (readonly [K, V])[],
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}
```

## Tagged template literal types
```ts
function sql<T extends string[]>(
  strings: TemplateStringsArray, ...values: T
): { text: string; values: T } {
  return { text: strings.join("?"), values };
}
```

---

# Most Frequently Asked Questions (2025–2026)

> Compiled from GreatFrontEnd, FrontendInterviewHandbook, DataCamp (2026), GeeksforGeeks, InterviewBit, Shadecoder (2026), Turing, CoderPad, Devinterview-io, DEV.to, Total TypeScript, Effective TypeScript, type-challenges, and Microsoft DevBlogs. Ranked by cross-source frequency.

## Top 30 — Junior / Mid (ranked by how often they appear)

| # | Question | Tests | Notes |
|---|----------|-------|-------|
| 1 | `any` vs `unknown` vs `never` — when to use each? | Type-safety mindset | Bottom/top types — `unknown` requires narrowing; `never` for exhaustive checks |
| 2 | `interface` vs `type` alias — which to use when? | Extensibility, declaration merging | Prefer `interface` for public object APIs; `type` for unions/intersections/mapped |
| 3 | Generics + `extends` constraints — explain with an example. | Reusability + inference | Be ready to write `function id<T extends { id: string }>(x: T): T` |
| 4 | Union vs intersection types — example? | Type composition | `A \| B` (either) vs `A & B` (both) |
| 5 | Type narrowing — `typeof`, `instanceof`, `in`, user predicates. | Control-flow analysis | Mention TS 5.5 inferred type predicates |
| 6 | Utility types tour: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `Awaited`, `NoInfer`. | Stdlib fluency | Know what each does AND how to implement 2–3 of them |
| 7 | `keyof`, `typeof`, indexed access — combine them. | Derived types | `type V = (typeof obj)["a"]` |
| 8 | `tsconfig.json` essentials — `strict`, `noImplicitAny`, `strictNullChecks`, `target`, `module`, `moduleResolution`. | Tooling | Be ready to explain each, and `strict` family contents |
| 9 | Discriminated unions + exhaustive `never` check. | Real-world modeling | Use the `assertNever(x: never)` pattern |
| 10 | Conditional types + `infer`. | Advanced type-level reasoning | `T extends (...a) => infer R ? R : never` |
| 11 | Type inference — when does it widen? When fail? | Practical typing | `let` widens to `string`; `const` keeps literal |
| 12 | `as` type assertions — when dangerous? | Escape hatches | Not validated at runtime; prefer guards/zod |
| 13 | Enums — trade-offs and modern alternatives (`as const` object + union, string literals). | Modern idioms | Bidirectional numeric enums; const enums + `isolatedModules` issues |
| 14 | Type React props/state/hooks (including custom hooks). | React+TS | `React.FC` is generally discouraged now |
| 15 | `unknown` vs `any` specifically — why prefer `unknown`? | Safety | `unknown` forces narrow before use |
| 16 | Template literal types (TS 4.1+). | String-level types | `\`on${Capitalize<K>}\`` |
| 17 | Access modifiers (`public`/`private`/`protected`) + `readonly` + JS `#private` fields. | OOP | TS `private` is compile-time only; `#` is runtime-enforced |
| 18 | Abstract class vs interface; `implements` vs `extends`. | Design | Abstract can have implementations; interface is pure shape |
| 19 | Declaration merging (interfaces, namespaces, modules). | Ambient typing | `declare module "express" { interface Request { user?: User } }` |
| 20 | Typing async functions + error handling under `useUnknownInCatchVariables`. | Practical async | `catch (e: unknown)` — narrow with `instanceof Error` |
| 21 | Mapped types (`{ [K in keyof T]: ... }`) + key remapping (`as`). | Foundation for utilities | TS 4.1+ remapping |
| 22 | Function overloading — and why a single signature with union is often better. | API design | Implementation signature is not callable |
| 23 | Tuples, labeled tuples, variadic tuples (`[first: T, ...rest: R]`). | Modern tuples | TS 4.0 labels; TS 5.2 mixed labels allowed |
| 24 | Structural ("duck") typing — what does it mean for assignability? | Mental model | Shape over name |
| 25 | Typing external API responses safely (Zod / type predicates / `unknown` + parse). | Runtime safety | Single source of truth from schema |
| 26 | Decorators — Stage-3 (TS 5.0) vs legacy `experimentalDecorators`. | Currency | Incompatible; NestJS/Angular still on legacy |
| 27 | `null` vs `undefined` under `strictNullChecks`. | Narrowing | `void` ≠ `undefined`; `== null` catches both |
| 28 | Index signatures vs `Record<K, V>`. | Object typing | `Record` is a mapped type; index sigs allow `string`/`number`/`symbol` |
| 29 | Modules vs namespaces today. | Tooling | Prefer ES modules; namespaces mostly legacy |
| 30 | React: `JSX.Element` vs `ReactNode` vs `ReactElement`. | React+TS | `ReactNode` is the widest (children type) |

---

## Top 22 — Senior / Staff / Architect

### Coding / Type-Level (asked verbatim or paraphrased)

**1. Implement `DeepPartial<T>` — and break it.**
Naive version recurses into objects but breaks on `Date`, `Map`, `Set`, functions, arrays/tuples. Discuss `exactOptionalPropertyTypes`. (See [Section: Mid Level Q3](#coding-q3-implement-deeppartialt).)

**2. Implement `UnionToIntersection<U>`.**
```ts
type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
```
Explain: contravariant parameter position causes multiple inferences to collapse to intersection.

**3. Implement `Get<T, Path>` (lodash `_.get` at the type level).** *(type-challenges classic)*
Template literal recursion + indexed access. Discuss compiler recursion limits + `type-fest`'s production version.

**4. Implement `Equals<X, Y>` (strict type equality).**
```ts
type Equals<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
```
Naive `X extends Y & Y extends X` fails because `any extends T` is always true. The internal-conditional-identity trick avoids this.

**5. Design a fully-typed event emitter.**
Mapped types over an event map; method `on<K extends keyof E>(e: K, cb: (...a: E[K]) => void)`. (See [Coding Q7](#coding-q7-type-safe-event-emitter).)

**6. Higher-Kinded Types in TS — workarounds.**
TS lacks HKTs; idiomatic workaround is the **URI trick** (fp-ts pattern): an interface keyed by string URIs, indexed to materialize the higher-kinded shape. Discuss compiler-perf cost.

### System / API Design

**7. `type` vs `interface` for a published library API.**
Prefer **`interface`** for exported object shapes — consumers can declaration-merge (`Express.Request`, `Window`). `extends` errors immediately on conflict; `&` silently collapses to `never` for incompatible primitives.

**8. Brand types for IDs, currency, units.**
```ts
type USD = number & { readonly __brand: "USD" };
const usd = (n: number): USD => n as USD; // smart constructor
```
Brand exists only at type level. Prevents `UserId` being assignable to `OrderId`.

**9. `satisfies` vs `as` vs `as const satisfies T`.**
`satisfies` = conformance check without widening. `as` = unchecked cast. `as const satisfies Config` = literal inference + validation. The canonical 2025 pattern for config objects, route maps, redux action maps.

**10. Bivariance, `strictFunctionTypes`, method vs property syntax.**
Property/arrow params become contravariant under `strictFunctionTypes`; **method shorthand stays bivariant** for DOM/lib ergonomics. (Already covered in [Senior Theory § Variance](#1-variance-covariance-contravariance-bivariance).)

**11. Variance annotations (`in` / `out`) — when to use them.**
Mostly helps performance for generics with many instantiations and disambiguates structural compatibility for empty types. Used in library type code (`Observable<out T>`).

**12. Exhaustiveness via `assertNever`.**
```ts
function assertNever(x: never, msg = "unexpected"): never { throw new Error(msg); }
// New variants then fail to compile.
```

### Performance / Build

**13. Why is my type-checker slow on a 100k-LOC codebase?**
Use `tsc --extendedDiagnostics` and `--generateTrace`. Common fixes: prefer `interface` over big intersections (intersections allocate symbols), name types instead of inlining, cap recursive conditionals, avoid huge unions, push computation to runtime.

**14. TS build perf in a large monorepo — your toolkit.**
Per-package `tsconfig` with `composite: true`; root with `references`; build with `tsc -b`. Cite real wins (e.g., a 22-package monorepo: 11 min → 3 min). Combine with `--isolatedDeclarations` (TS 5.5) so packages emit `.d.ts` in parallel without resolving cross-package implementations.

**15. Migrating a 500k-LOC JS codebase to TS — strategy.**
`allowJs` + `checkJs` → migrate leaf modules first (dependency-graph order). Tools: Airbnb's **`ts-migrate`** for bulk rename + `$TSFixMe`. **Ratchet** strictness via CI counter — fail on regression, never on absolute count. Enable `strict` flags one-by-one (`noImplicitAny` first, `strictNullChecks` last).

### Runtime / Ecosystem

**16. Runtime validation: Zod vs Valibot vs ArkType.**
- **Zod** — ecosystem winner (~20M weekly DLs, huge integration count); largest bundle.
- **Valibot** — plain functions → best tree-shaking; ideal for edge/frontend.
- **ArkType** — fastest (~3–4× Zod) via JIT-compiled string DSL; younger ecosystem.
For most APIs, perf is not the bottleneck → choose on ecosystem + DX.

**17. Type-level API stability when publishing a package.**
Export interfaces (mergeable), avoid `any` in public surface, gate internal types with `@internal` + API Extractor, set `typesVersions`, ship a single `.d.ts` rollup, run `attw` (Are The Types Wrong?) in CI. **Type-shape breakage = major bump.**

**18. ECMAScript decorators (TS 5.0) vs legacy `experimentalDecorators`.**
Stage-3 is now standard syntax: `(value, context)` signature, wrappers (not prototype-mutators), incompatible with legacy. They lack parameter decorators and `emitDecoratorMetadata` — so DI frameworks (Nest, TypeORM) still need `experimentalDecorators`. Plan migrations accordingly.

### Latest-Feature Distinguishers (TS 5.x — currency check)

**19. Why use `satisfies` instead of an annotation or `as` cast?**
Annotations widen literal types; `as` is an unsafe cast; `satisfies` validates the value matches `T` while keeping the narrow inferred type for downstream calls.

**20. Give a real `NoInfer<T>` use case.**
Generic function with a "default/fallback" arg that shouldn't drive inference:
```ts
function createState<T>(initial: T, fallback: NoInfer<T>): T { /* ... */ }
createState<"a" | "b">("a", "b"); // fallback can't widen T
```
Real cases: i18n key dictionaries, Zustand stores, animation `from`/`to` pairs.

**21. What changed about type predicates in TS 5.5?**
TS now **infers** `x is T` for simple filtering predicates. `arr.filter(x => x !== null)` narrows to `NonNullable<T>[]` automatically. Caveat: truthiness checks like `Boolean` / `!!x` are not inferred (would violate iff semantics — `0` is falsy but still `number`). Style change: hundreds of hand-rolled `isFoo` guards are now redundant.

**22. The native (Go) TypeScript compiler — what is it, and when does it matter?**
Microsoft's port of the compiler/LSP from JS to Go. Targets ~10× faster type-checking, ~8× faster editor project load, roughly half the memory. Same type semantics. Run as `tsgo`. **Matters most for**: huge codebases, monorepos, editor responsiveness, CI. **Doesn't matter for**: small libs (already fast), tooling embedding `ts.createProgram` (won't drop-in until ecosystem support). Treat as preview until GA.

---

## TS 5.x Feature-Specific Quick-Hits (currency questions)

| Question | Version | Key Point |
|----------|---------|-----------|
| Why `const` type parameters? | 5.0 | Caller doesn't need `as const` — preserves literal types |
| `using` declarations — what problem? | 5.2 | Deterministic resource cleanup, no try/finally boilerplate |
| `Symbol.dispose` / `Symbol.asyncDispose` — what for? | 5.2 | Hooks for `using` / `await using` |
| `import ... with { type: "json" }` vs `assert`? | 5.3 | Attributes affect resolution; assertions deprecated |
| Inferred type predicates rule of thumb? | 5.5 | Use `x => x != null` (not `Boolean`) to get inference |
| `--isolatedDeclarations` — why care in monorepos? | 5.5 | Parallel `.d.ts` emit without TS doing implementation type-check |
| `--noUncheckedSideEffectImports` — what does it catch? | 5.6 | Errors on `import "./missing"` (silently ignored before) |
| Why did `Uint8Array` become generic? | 5.7 | ES2024 `ArrayBuffer` vs `SharedArrayBuffer` split |
| `--erasableSyntaxOnly` — what does it ban and why? | 5.8 | `enum`, `namespace` (with values), parameter properties, `import =` — so Node 22+/23+ can run TS natively via type-stripping |
| Pair `--erasableSyntaxOnly` with…? | 5.8 | `--verbatimModuleSyntax` (force explicit `import type`) |
| `import defer` — purpose? | 5.9 | Deferred module evaluation (ES proposal) |

---

# Suggested Interview Drill Plan (2 weeks)

| Day | Focus |
|-----|-------|
| 1–2 | Junior theory + Q1–Q2 |
| 3–4 | Mid theory + utility types + Q3–Q5 |
| 5–6 | Conditional & mapped types + Q6 |
| 7   | Discriminated unions + variance |
| 8–9 | Senior coding Q7–Q9 |
| 10  | TS 5.x feature deep dive |
| 11–12 | Staff-level type API design + Q10–Q12 |
| 13  | Gotchas / trick Qs |
| 14  | Mock interview + timed `type-challenges` (easy + medium) |

**Recommended practice**: [type-challenges](https://github.com/type-challenges/type-challenges) — solve easy + medium tier minimum.

---

# Quick Self-Test (answer in your head)

1. What does `as const` do exactly?
2. Why is `function (x: Animal) => void` assignable to `function (x: Dog) => void` only without `strictFunctionTypes`?
3. Implement `UnionToIntersection<U>` from scratch.
4. When does `infer` extract a union vs an intersection?
5. Why might `tsc` be slow on a large codebase, and 3 things to try?
6. What does `satisfies` give you that a type annotation doesn't?
7. How do TS 5.0 decorators differ from `experimentalDecorators`?
8. What's `NoInfer<T>` for, with an example?
9. Why prefer `interface` over `type` for large object models?
10. How would you brand a `UserId` and prevent it being passed where `OrderId` is expected?

---

# Authoritative Sources (verified May 2026)

All version-specific claims above were cross-checked against the official TypeScript release notes and handbook. Always re-verify against these primary sources before quoting in an interview:

- TypeScript Handbook — https://www.typescriptlang.org/docs/handbook/
- Release Notes index — https://www.typescriptlang.org/docs/handbook/release-notes/
  - 5.0 · 5.1 · 5.2 · 5.3 · 5.4 · 5.5 · 5.6 · 5.7 · 5.8 · 5.9
- TSConfig reference — https://www.typescriptlang.org/tsconfig/
- Microsoft TypeScript DevBlogs (release announcements) — https://devblogs.microsoft.com/typescript/
- Native (Go) port announcement — https://devblogs.microsoft.com/typescript/typescript-native-port/
- Do's and Don'ts — https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html
- type-challenges practice repo — https://github.com/type-challenges/type-challenges

---

**Bonus answer — Q3 `UnionToIntersection`:**
```ts
type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

type I = UnionToIntersection<{ a: 1 } | { b: 2 }>; // { a: 1 } & { b: 2 }
```
Uses contravariance of function parameters: distributing into a function-param position turns the union into an intersection.
