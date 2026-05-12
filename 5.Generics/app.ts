// Generics — executable examples.
// Verified with: tsc --noEmit  (target ES2022, strict, lib ES2022+DOM, TS 5.8)

// ---------------------------------------------------------------------------
// 1. Built-in generics
// ---------------------------------------------------------------------------

const names: Array<string> = ['Max', 'Manuel']
names[0].split(' ')

const promise: Promise<string> = new Promise((resolve) =>
  setTimeout(() => resolve('done'), 1)
)
promise.then((data) => data.split(' '))

const map: Map<string, number> = new Map()
map.set('a', 1)
const v: number | undefined = map.get('a')
void v

// ---------------------------------------------------------------------------
// 2. Generic functions, multiple type params, constraints
// ---------------------------------------------------------------------------

function identity<T>(x: T): T {
  return x
}
const x: number = identity(42)
void x

function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return Object.assign({}, a, b)
}
const m = merge({ name: 'Max' }, { age: 30 })
void m.name
void m.age

interface Lengthy {
  length: number
}

function describe<T extends Lengthy>(x: T): [T, string] {
  return [x, `Got ${x.length} element${x.length === 1 ? '' : 's'}.`]
}
describe('Hi there!')
describe(['sport', 'cook'])
// describe(123)  // ❌

// ---------------------------------------------------------------------------
// 3. keyof + indexed access
// ---------------------------------------------------------------------------

function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { id: '1', name: 'Max', age: 30 }
const userName: string = get(user, 'name')
const userAge: number = get(user, 'age')
void userName
void userAge
// get(user, 'email')  // ❌

function pick<T, K extends (keyof T)[]>(
  obj: T,
  ...keys: K
): Pick<T, K[number]> {
  return keys.reduce(
    (acc, k) => ({ ...acc, [k]: obj[k] }),
    {} as Pick<T, K[number]>
  )
}
const slim = pick(user, 'id', 'name')
void slim.id
void slim.name

// ---------------------------------------------------------------------------
// 4. Default type parameters
// ---------------------------------------------------------------------------

type ApiResponse<TData = unknown, TError = Error> = {
  ok: boolean
  data?: TData
  error?: TError
}

const r1: ApiResponse = { ok: false }
const r2: ApiResponse<{ id: string }> = { ok: true, data: { id: '1' } }
void r1
void r2

function box<T = string>(value: T): { value: T } {
  return { value }
}
const boxStr = box('hi')
const boxNum = box<number>(42)
void boxStr
void boxNum

// ---------------------------------------------------------------------------
// 5. const type parameters (TS 5.0)
// ---------------------------------------------------------------------------

function pickKeys<T extends readonly string[]>(keys: T): T {
  return keys
}
const k1 = pickKeys(['a', 'b']) // string[]
void k1

function pickKeysConst<const T extends readonly string[]>(keys: T): T {
  return keys
}
const k2 = pickKeysConst(['a', 'b']) // readonly ["a", "b"]
void k2

// ---------------------------------------------------------------------------
// 6. Variadic tuple types (TS 4.0+)
// ---------------------------------------------------------------------------

function callIt<T extends unknown[], R>(fn: (...args: T) => R, ...args: T): R {
  return fn(...args)
}

callIt((a: number, b: string) => `${a}-${b}`, 1, 'x')

type Concat<A extends readonly unknown[], B extends readonly unknown[]> = [
  ...A,
  ...B
]
type CTest = Concat<[1, 2], [3, 4]>
const concat: CTest = [1, 2, 3, 4]
void concat

// ---------------------------------------------------------------------------
// 7. Generic classes — primitive-constrained storage
// ---------------------------------------------------------------------------

class DataStorage<T extends string | number | boolean> {
  private data: T[] = []
  add(item: T) {
    this.data.push(item)
  }
  remove(item: T) {
    const i = this.data.indexOf(item)
    if (i >= 0) this.data.splice(i, 1)
  }
  list(): readonly T[] {
    return [...this.data]
  }
}

const text = new DataStorage<string>()
text.add('Max')
text.add('Manu')
text.remove('Manu')
void text.list()

// ---------------------------------------------------------------------------
// 8. Generic interface
// ---------------------------------------------------------------------------

interface Repository<T extends { id: string }> {
  find(id: string): Promise<T | null>
  save(entity: T): Promise<T>
  delete(id: string): Promise<void>
}

class InMemoryRepo<T extends { id: string }> implements Repository<T> {
  private store = new Map<string, T>()
  async find(id: string) {
    return this.store.get(id) ?? null
  }
  async save(entity: T) {
    this.store.set(entity.id, entity)
    return entity
  }
  async delete(id: string) {
    this.store.delete(id)
  }
}
void new InMemoryRepo<{ id: string; name: string }>()

// ---------------------------------------------------------------------------
// 9. Generics vs unions
// ---------------------------------------------------------------------------

function describeUnion(x: string | number) {
  return typeof x === 'string' ? x.toUpperCase() : x.toFixed(2)
}
function describeGeneric<T>(x: T): T {
  return x
}
const a: string = describeGeneric('hi')
const b: number = describeGeneric(42)
void describeUnion
void a
void b

// ---------------------------------------------------------------------------
// 10. NoInfer<T> (TS 5.4)
// ---------------------------------------------------------------------------

function createState<T>(initial: T, fallback: NoInfer<T>): T {
  return initial ?? fallback
}
createState<'on' | 'off'>('on', 'off')
// createState<'on' | 'off'>('on', 'pause')  // ❌

// ---------------------------------------------------------------------------
// 11. Variance annotations (TS 4.7)
// ---------------------------------------------------------------------------

interface Producer<out T> {
  produce(): T
}
interface Consumer<in T> {
  consume(x: T): void
}
interface Processor<in out T> {
  run(x: T): T
}
void ({} as Producer<string>)
void ({} as Consumer<string>)
void ({} as Processor<string>)

// ---------------------------------------------------------------------------
// 12. Utility-type cameos
// ---------------------------------------------------------------------------

interface CourseGoal {
  title: string
  description: string
  completeUntil: Date
}

function createCourseGoal(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  const draft: Partial<CourseGoal> = {}
  draft.title = title
  draft.description = description
  draft.completeUntil = date
  return draft as CourseGoal
}
void createCourseGoal('TS', 'deep dive', new Date())

const ro: Readonly<string[]> = ['Max', 'Anna']
// ro.push('Manu')  // ❌
void ro

type AwaitedNested = Awaited<Promise<Promise<number>>> // number
const awaited: AwaitedNested = 1
void awaited

// ---------------------------------------------------------------------------
// 13. Patterns
// ---------------------------------------------------------------------------

// 13a. Type-safe pluck
function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map((x) => x[key])
}
const ages: number[] = pluck(
  [
    { name: 'a', age: 1 },
    { name: 'b', age: 2 },
  ],
  'age'
)
void ages

// 13b. Generic factory
function factory<T extends new (...a: any[]) => any>(Ctor: T) {
  return (...args: ConstructorParameters<T>): InstanceType<T> =>
    new Ctor(...args)
}

class UserCtor {
  constructor(public name: string, public age: number) {}
}
const makeUser = factory(UserCtor)
const u = makeUser('Max', 30) // u: UserCtor
void u

// 13c. Builder
class QueryBuilder<T = {}> {
  private state = {} as T
  set<K extends string, V>(
    key: K,
    value: V
  ): QueryBuilder<T & Record<K, V>> {
    ;(this.state as any)[key] = value
    return this as unknown as QueryBuilder<T & Record<K, V>>
  }
  build(): T {
    return this.state
  }
}

const q = new QueryBuilder()
  .set('limit', 10)
  .set('order', 'asc')
  .build()
void q

// 13d. Result<T, E>
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

function tryParse<T>(input: string, parse: (s: string) => T): Result<T> {
  try {
    return { ok: true, value: parse(input) }
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e : new Error(String(e)),
    }
  }
}
const parsed = tryParse('{"a":1}', JSON.parse)
if (parsed.ok) void parsed.value
else void parsed.error
