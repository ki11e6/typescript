# Decorators

This chapter covers **TypeScript 5.0+ Stage-3 ECMAScript decorators** — the standard syntax that ships without the `experimentalDecorators` flag. A short [legacy appendix](#appendix-legacy-decorators-experimentaldecorators) is kept at the bottom for context, because frameworks like Angular, NestJS and TypeORM still depend on it.

### Useful Resources

- [TypeScript 5.0 release notes — Decorators](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators)
- [TypeScript 5.2 release notes — Decorator metadata](https://devblogs.microsoft.com/typescript/announcing-typescript-5-2/#decorator-metadata)
- [TC39 proposal-decorators](https://github.com/tc39/proposal-decorators)
- [TC39 proposal-decorator-metadata](https://github.com/tc39/proposal-decorator-metadata)

---

## Why two flavours of decorators exist

There are **two incompatible decorator systems** in the TypeScript world. Knowing which one a file uses is essential.

| | Stage-3 (modern) | Legacy (experimental) |
|---|---|---|
| Spec | TC39 Stage-3 (ECMAScript) | Old, Stage-1 proposal |
| Available since | TypeScript 5.0 | TypeScript 1.5 |
| `tsconfig.json` flag | none — works by default | `"experimentalDecorators": true` |
| Decorator signature | `(value, context) => …` | `(target, propertyKey, descriptor) => …` |
| Parameter decorators | **Not supported** | Supported |
| Metadata | `context.metadata` + `Symbol.metadata` (TS 5.2) | `emitDecoratorMetadata` + `reflect-metadata` |
| Used by | New code, no DI dependency | Angular, NestJS, TypeORM (parameter-decorator DI) |

The flag is **per-project**: a single file cannot mix the two systems.

---

## `tsconfig.json` for Stage-3

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",            // Stage-3 assumes native class-field semantics
    "module": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "ESNext.Decorators"], // ESNext.Decorators adds DecoratorMetadata / Symbol.metadata types
    "strict": true
    // "experimentalDecorators": false   // omit or set false
    // "emitDecoratorMetadata": false    // does not work with Stage-3
  }
}
```

> **Polyfill for `Symbol.metadata`** — most runtimes don't define it yet. Either include `@tsmetadata/polyfill`, or do this once at startup:
> ```ts
> (Symbol as any).metadata ??= Symbol.for("Symbol.metadata");
> ```

---

## A first class decorator

Decorators are plain functions. A class decorator receives the **constructor** and a **context**, and may return a replacement class (or `void`).

```ts
function logged<C extends abstract new (...a: any[]) => any>(
  value: C,
  context: ClassDecoratorContext<C>
): C {
  console.log(`Defining class: ${String(context.name)}`);
  return value;
}

@logged
class Person {
  constructor(public name: string) {}
}
```

Decorators run when the **class is defined**, not when an instance is created.

### Decorator factories

To pass arguments, wrap the decorator in a factory:

```ts
function logged(prefix: string) {
  return function <C extends abstract new (...a: any[]) => any>(
    value: C,
    context: ClassDecoratorContext<C>
  ): C {
    console.log(`${prefix}: ${String(context.name)}`);
    return value;
  };
}

@logged("LOG")
class Person { constructor(public name: string) {} }
```

### Returning a subclass

A class decorator can return a subclass to extend behaviour:

```ts
function withTimestamp<C extends new (...a: any[]) => object>(
  value: C,
  _ctx: ClassDecoratorContext<C>
) {
  return class extends value {
    createdAt = new Date();
  };
}

@withTimestamp
class Order { constructor(public id: string) {} }

new Order("o1").createdAt; // Date
```

### Applying multiple decorators

Decorators stack bottom-up: the **closest** decorator runs first, the outermost runs last.

```ts
@logged("OUTER")
@logged("INNER")
class Demo {}
// prints: INNER, OUTER
```

---

## Decorator anatomy: `(value, context)`

Every Stage-3 decorator receives **two** arguments:

1. **`value`** — what is being decorated. The shape depends on the kind:
   - class → the constructor
   - method / getter / setter → the function
   - accessor → `{ get, set }`
   - field → always `undefined`
2. **`context`** — a record describing the element. The shape depends on the kind, but most context objects share these fields:

```ts
interface SharedDecoratorContext {
  readonly kind: "class" | "method" | "getter" | "setter" | "accessor" | "field";
  readonly name: string | symbol;
  readonly static: boolean;      // not on ClassDecoratorContext
  readonly private: boolean;     // not on ClassDecoratorContext
  readonly access: { has(o: any): boolean; /* + get / set depending on kind */ };
  addInitializer(initializer: (this: any) => void): void;
  readonly metadata: DecoratorMetadata; // TS 5.2+
}
```

> `ClassDecoratorContext` only has `kind`, `name`, `addInitializer`, `metadata` — no `static`/`private`/`access`.

---

## Method decorators

A method decorator receives the function and returns a (usually wrapping) replacement function — or `void` to leave it unchanged.

```ts
function logged<This, A extends any[], R>(
  fn: (this: This, ...a: A) => R,
  ctx: ClassMethodDecoratorContext<This, (this: This, ...a: A) => R>
) {
  const name = String(ctx.name);
  return function (this: This, ...args: A): R {
    console.log(`-> ${name}`, args);
    const result = fn.apply(this, args);
    console.log(`<- ${name}`, result);
    return result;
  };
}

class Calculator {
  @logged
  add(a: number, b: number) { return a + b; }
}

new Calculator().add(2, 3);
// -> add [2, 3]
// <- add 5
```

### `@deprecated(message)` — factory example

```ts
function deprecated(message = "") {
  return function <This, A extends any[], R>(
    fn: (this: This, ...a: A) => R,
    ctx: ClassMethodDecoratorContext<This, (this: This, ...a: A) => R>
  ) {
    return function (this: This, ...args: A): R {
      console.warn(`DEPRECATED ${String(ctx.name)}: ${message}`);
      return fn.apply(this, args);
    };
  };
}

class OldApi {
  @deprecated("use v2() instead")
  v1() { /* … */ }
}
```

---

## `addInitializer` — `@bind` without a descriptor

Legacy `@autobind` rewrote the property descriptor. Stage-3 doesn't have descriptors; instead, the method decorator schedules an initializer that runs **once per instance during construction**, with `this` bound to the new instance.

```ts
function bind<This, V extends (this: This, ...a: any[]) => any>(
  _value: V,
  ctx: ClassMethodDecoratorContext<This, V>
) {
  if (ctx.private) throw new Error("@bind does not support private methods");
  ctx.addInitializer(function (this: This) {
    (this as any)[ctx.name] = (this as any)[ctx.name].bind(this);
  });
}

class Printer {
  message = "This works!";
  @bind
  show() { console.log(this.message); }
}

const p = new Printer();
document.querySelector("button")!.addEventListener("click", p.show); // `this` stays correct
```

`addInitializer` is also available on field, accessor, getter/setter, and class contexts:
- **instance** decorators: runs at the start of each `new …()` call
- **static** decorators: runs once when the class is being defined
- **class** decorator: runs after the class is fully constructed (`this` is the constructor)

---

## Field decorators

A field decorator's `value` is always `undefined`. Its return value (optional) is an **initializer**: `(this, initialValue) => newValue`. The initializer runs **once at construction** — it cannot intercept later writes.

```ts
function required<This, V>(
  _value: undefined,
  ctx: ClassFieldDecoratorContext<This, V>
) {
  return function (this: This, initial: V): V {
    if (initial === undefined || initial === null) {
      throw new Error(`${String(ctx.name)} is required`);
    }
    return initial;
  };
}

class Course {
  @required title!: string;
  constructor(title: string) { this.title = title; }
}
```

> To run validation on **every** assignment, use `accessor` instead — see below.

---

## Auto-accessor decorators (`accessor` keyword)

`accessor` (TS 4.9+) desugars a field into a getter/setter pair backed by a private storage slot. A decorator on an auto-accessor can replace any of `{ get, set, init }`.

```ts
function clamp(min: number, max: number) {
  return function <This>(
    target: ClassAccessorDecoratorTarget<This, number>,
    ctx: ClassAccessorDecoratorContext<This, number>
  ): ClassAccessorDecoratorResult<This, number> {
    const pin = (v: number) => Math.max(min, Math.min(max, v));
    return {
      set(v) { target.set.call(this, pin(v)); },
      init(v) { return pin(v); },
      // `get` omitted -> the original getter is used
    };
  };
}

class Volume {
  @clamp(0, 100) accessor level = 50;
}

const v = new Volume();
v.level = 999;
console.log(v.level); // 100
```

---

## Getter & setter decorators

Wrap a single accessor half:

```ts
function logGets<This, V>(
  getter: (this: This) => V,
  ctx: ClassGetterDecoratorContext<This, V>
) {
  return function (this: This): V {
    const v = getter.call(this);
    console.log(`get ${String(ctx.name)} ->`, v);
    return v;
  };
}

class Person {
  #name = "Max";
  @logGets get name() { return this.#name; }
}
```

---

## Decorator metadata (TS 5.2)

Each decorator receives the same shared `metadata` object via `context.metadata`. After all decorators on a class have run, the object is attached to the class under `Symbol.metadata`. This lets you build serializers, validators, DI registries, etc. without `reflect-metadata`.

```ts
// Polyfill once at startup
(Symbol as any).metadata ??= Symbol.for("Symbol.metadata");

const SERIALIZE = Symbol("serialize");

function serialize<This, V>(
  _v: undefined,
  ctx: ClassFieldDecoratorContext<This, V>
) {
  const list = (ctx.metadata[SERIALIZE] ??= []) as (string | symbol)[];
  list.push(ctx.name);
}

function jsonify(obj: object): string {
  const ctor = obj.constructor as { [Symbol.metadata]?: DecoratorMetadata };
  const keys = (ctor[Symbol.metadata]?.[SERIALIZE] ?? []) as (keyof typeof obj)[];
  return JSON.stringify(Object.fromEntries(keys.map(k => [k, obj[k]])));
}

class User {
  @serialize name = "Ada";
  @serialize email = "ada@example.com";
  password = "secret";   // not serialized
}

console.log(jsonify(new User())); // {"name":"Ada","email":"ada@example.com"}
```

Subclass metadata objects prototype-inherit from the parent's — useful for class hierarchies.

---

## A real example: field validation via metadata

Below is the legacy `@Required` / `@PositiveNumber` example rewritten for Stage-3. Because field decorators can't intercept later writes, we use **auto-accessors** so validation runs on every assignment.

```ts
(Symbol as any).metadata ??= Symbol.for("Symbol.metadata");

const VALIDATORS = Symbol("validators");
type Check = (value: unknown) => boolean;

// Factory is non-generic; the returned decorator stays polymorphic
// over `This` and `V` so it can be applied to any auto-accessor.
function check(rule: Check, ruleName: string) {
  return function <This, V>(
    target: ClassAccessorDecoratorTarget<This, V>,
    ctx: ClassAccessorDecoratorContext<This, V>
  ): ClassAccessorDecoratorResult<This, V> {
    const map = (ctx.metadata[VALIDATORS] ??= {}) as Record<string | symbol, string[]>;
    (map[ctx.name] ??= []).push(ruleName);

    return {
      set(v) {
        if (!rule(v)) throw new Error(`${String(ctx.name)} failed: ${ruleName}`);
        target.set.call(this, v);
      },
      init(v) {
        if (!rule(v)) throw new Error(`${String(ctx.name)} failed: ${ruleName}`);
        return v;
      },
    };
  };
}

const Required = check((v) => v != null && v !== "", "required");
const Positive = check((v) => typeof v === "number" && v > 0, "positive");

class Course {
  @Required accessor title: string = "";
  @Positive accessor price: number = 1;
  constructor(title: string, price: number) {
    this.title = title;
    this.price = price;
  }
}

new Course("TS in depth", 49); // ok
// new Course("", 49);          // throws: title failed: required
// new Course("TS", -5);        // throws: price failed: positive
```

---

## Class registry

```ts
const registry = new Set<Function>();

function register<C extends new (...a: any[]) => any>(
  value: C,
  _ctx: ClassDecoratorContext<C>
) {
  registry.add(value);
}

@register class A {}
@register class B {}

console.log([...registry].map(c => c.name)); // ["A", "B"]
```

---

## Summary cheat sheet

| Decorator kind | `value` | Can return | Wraps via |
|----------------|--------|-----------|-----------|
| Class | constructor | replacement constructor / `void` | subclass or new constructor |
| Method | function | replacement function / `void` | wrapping function |
| Getter | getter function | replacement getter / `void` | wrapping function |
| Setter | setter function | replacement setter / `void` | wrapping function |
| Accessor | `{ get, set }` | `{ get?, set?, init? }` / `void` | full or partial override |
| Field | `undefined` | initializer `(this, init) => V` / `void` | runs once at construction |

Cross-cutting setup (binding `this`, registering handlers) → use **`ctx.addInitializer`**.
Read-modify-write semantics on a field → use **`accessor`**, not `field`.
Cross-decorator data → write to **`ctx.metadata`** and read via `klass[Symbol.metadata]`.

---

## Appendix: legacy decorators (`experimentalDecorators`)

Still required by **Angular**, **NestJS**, **TypeORM**, and any framework that depends on:
- **parameter decorators** (e.g. `constructor(@Inject('TOKEN') x)`) — Stage-3 has no equivalent yet
- **`emitDecoratorMetadata`** writing `design:type`, `design:paramtypes`, `design:returntype` into the `Reflect` metadata store (used by `reflect-metadata` for DI)

Legacy tsconfig:

```jsonc
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "ES2017"
  }
}
```

Legacy signatures (kept here for recognition only):

```ts
// class
function Logger(constructor: Function) {}

// property / field
function Log(target: any, propertyName: string | symbol) {}

// accessor / method
function Log2(target: any, name: string | symbol, descriptor: PropertyDescriptor) {}

// parameter — NOT available in Stage-3
function Log4(target: any, name: string | symbol, position: number) {}
```

A legacy `@Autobind`:

```ts
function Autobind(_t: any, _n: string | symbol, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  return {
    configurable: true,
    enumerable: false,
    get() { return original.bind(this); },
  } as PropertyDescriptor;
}
```

The Stage-3 equivalent is the `@bind` example above — no descriptor object, uses `addInitializer` instead.

**Migration tip**: don't migrate piecemeal. The flag is per-project, and the two systems generate different code. Plan a single switchover, or keep legacy until your framework supports Stage-3.
