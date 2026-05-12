// TypeScript 5.0+ Stage-3 ECMAScript decorators.
// tsconfig must NOT have "experimentalDecorators": true.
// Recommended: "target": "ES2022", "useDefineForClassFields": true,
//              "lib": ["ES2022", "DOM", "ESNext.Decorators"].

// Polyfill Symbol.metadata for runtimes that don't define it yet.
(Symbol as any).metadata ??= Symbol.for('Symbol.metadata')

// ---------------------------------------------------------------------------
// 1. Class decorator + factory
// ---------------------------------------------------------------------------

function logged(prefix: string) {
  return function <C extends abstract new (...a: any[]) => any>(
    value: C,
    ctx: ClassDecoratorContext<C>
  ): C {
    console.log(`${prefix}: ${String(ctx.name)}`)
    return value
  }
}

// Class decorator returning a subclass to inject extra behaviour.
function withTimestamp<C extends new (...a: any[]) => object>(
  value: C,
  _ctx: ClassDecoratorContext<C>
) {
  return class extends value {
    createdAt = new Date()
  }
}

@logged('LOG')
@withTimestamp
class Person {
  constructor(public name: string) {}
}

const p = new Person('Max')
console.log(p.name, (p as any).createdAt)

// ---------------------------------------------------------------------------
// 2. Method decorator: @logMethod
// ---------------------------------------------------------------------------

function logMethod<This, A extends any[], R>(
  fn: (this: This, ...a: A) => R,
  ctx: ClassMethodDecoratorContext<This, (this: This, ...a: A) => R>
) {
  const name = String(ctx.name)
  return function (this: This, ...args: A): R {
    console.log(`-> ${name}`, args)
    const result = fn.apply(this, args)
    console.log(`<- ${name}`, result)
    return result
  }
}

class Calculator {
  @logMethod
  add(a: number, b: number) {
    return a + b
  }
}

new Calculator().add(2, 3)

// ---------------------------------------------------------------------------
// 3. addInitializer-based @bind (Stage-3 replacement for legacy @Autobind)
// ---------------------------------------------------------------------------

function bind<This, V extends (this: This, ...a: any[]) => any>(
  _value: V,
  ctx: ClassMethodDecoratorContext<This, V>
) {
  if (ctx.private) throw new Error('@bind does not support private methods')
  ctx.addInitializer(function (this: This) {
    ;(this as any)[ctx.name] = (this as any)[ctx.name].bind(this)
  })
}

class Printer {
  message = 'This works!'

  @bind
  show() {
    console.log(this.message)
  }
}

const printer = new Printer()
// Stays bound even when detached:
const detached = printer.show
detached()

// ---------------------------------------------------------------------------
// 4. Auto-accessor decorator: @clamp for read/write validation
// ---------------------------------------------------------------------------

function clamp(min: number, max: number) {
  return function <This>(
    target: ClassAccessorDecoratorTarget<This, number>,
    _ctx: ClassAccessorDecoratorContext<This, number>
  ): ClassAccessorDecoratorResult<This, number> {
    const pin = (v: number) => Math.max(min, Math.min(max, v))
    return {
      set(v) {
        target.set.call(this, pin(v))
      },
      init(v) {
        return pin(v)
      },
    }
  }
}

class Volume {
  @clamp(0, 100) accessor level = 50
}

const vol = new Volume()
vol.level = 9999
console.log(vol.level) // 100

// ---------------------------------------------------------------------------
// 5. Decorator metadata (TS 5.2) — replaces the legacy validators registry
// ---------------------------------------------------------------------------

const VALIDATORS = Symbol('validators')
type Rule = (value: unknown) => boolean

// Factory is non-generic so the returned decorator can stay polymorphic
// over `This` and `V` at every application site.
function check(rule: Rule, ruleName: string) {
  return function <This, V>(
    target: ClassAccessorDecoratorTarget<This, V>,
    ctx: ClassAccessorDecoratorContext<This, V>
  ): ClassAccessorDecoratorResult<This, V> {
    const map = (ctx.metadata[VALIDATORS] ??= {}) as Record<
      string | symbol,
      string[]
    >
    ;(map[ctx.name] ??= []).push(ruleName)

    return {
      set(v) {
        if (!rule(v)) throw new Error(`${String(ctx.name)} failed: ${ruleName}`)
        target.set.call(this, v)
      },
      init(v) {
        if (!rule(v)) throw new Error(`${String(ctx.name)} failed: ${ruleName}`)
        return v
      },
    }
  }
}

const Required = check((v) => v != null && v !== '', 'required')
const Positive = check(
  (v) => typeof v === 'number' && v > 0,
  'positive'
)

class Course {
  @Required accessor title: string = ''
  @Positive accessor price: number = 1

  constructor(title: string, price: number) {
    this.title = title
    this.price = price
  }
}

try {
  new Course('TS in depth', 49)
  new Course('', 49) // throws
} catch (err) {
  console.log('expected:', (err as Error).message)
}

// Read the metadata back at runtime:
const meta = (Course as unknown as { [Symbol.metadata]?: DecoratorMetadata })[
  Symbol.metadata!
]
console.log('Course validators:', meta?.[VALIDATORS])
