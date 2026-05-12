// Advanced Types — executable examples.
// Verified with: tsc --noEmit  (target ES2022, strict, lib ES2022+DOM, TS 5.8)

// ---------------------------------------------------------------------------
// 1. Intersection (objects combine; unions intersect to common members)
// ---------------------------------------------------------------------------

type Admin = { name: string; privileges: string[] };
type Employee = { name: string; startDate: Date };
type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: 'Max',
  privileges: ['create-server'],
  startDate: new Date(),
};
void e1;

type Combinable = string | number;
type Numeric = number | boolean;
type Universal = Combinable & Numeric; // number
const u: Universal = 11;
void u;

// ---------------------------------------------------------------------------
// 2. keyof + indexed access + generic getter
// ---------------------------------------------------------------------------

type User = { id: string; name: string; age: number };

function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const usr: User = { id: '1', name: 'Max', age: 30 };
const n: string = get(usr, 'name');
const a: number = get(usr, 'age');
void n; void a;

// ---------------------------------------------------------------------------
// 3. Narrowing — typeof / instanceof / in / user-defined predicate / asserts
// ---------------------------------------------------------------------------

function describe(x: string | number | Date): string {
  if (typeof x === 'string') return x.toUpperCase();
  if (x instanceof Date) return x.toISOString();
  return x.toFixed(2);
}
void describe('hi');

type Cat = { kind: 'cat'; meow: () => void };
type Dog = { kind: 'dog'; bark: () => void };

function isCat(animal: Cat | Dog): animal is Cat {
  return animal.kind === 'cat';
}

function speak(a: Cat | Dog) {
  if (isCat(a)) a.meow();
  else a.bark();
}
void speak;

// TS 5.5 inferred type predicate — explicit `!= null` rather than Boolean
const mixed: (string | null)[] = ['a', null, 'b'];
const nonNull: string[] = mixed.filter((x) => x !== null);
void nonNull;

// asserts x is T
function assertIsString(x: unknown): asserts x is string {
  if (typeof x !== 'string') throw new TypeError('not a string');
}
function shout(input: unknown): string {
  assertIsString(input);
  return input.toUpperCase();
}
void shout;

// ---------------------------------------------------------------------------
// 4. Discriminated unions + exhaustiveness via assertNever
// ---------------------------------------------------------------------------

type Bird = { kind: 'bird'; flyingSpeed: number };
type Horse = { kind: 'horse'; runningSpeed: number };
type Fish = { kind: 'fish'; swimmingSpeed: number };
type Animal = Bird | Horse | Fish;

function assertNever(x: never): never {
  throw new Error('Unhandled variant: ' + JSON.stringify(x));
}

function moveAnimal(a: Animal): number {
  switch (a.kind) {
    case 'bird':
      return a.flyingSpeed;
    case 'horse':
      return a.runningSpeed;
    case 'fish':
      return a.swimmingSpeed;
    default:
      return assertNever(a);
  }
}
void moveAnimal({ kind: 'bird', flyingSpeed: 10 });

// ---------------------------------------------------------------------------
// 5. Type assertions: `as`, `as const`, brief comparison with narrowing
// ---------------------------------------------------------------------------

const maybeInput = document.getElementById('user-input');
if (maybeInput instanceof HTMLInputElement) {
  maybeInput.value = 'Hi there!'; // narrowed; no `as` needed
}

const colorsConst = ['red', 'green', 'blue'] as const;
type Color = (typeof colorsConst)[number]; // "red" | "green" | "blue"
const c: Color = 'red';
void c;

// ---------------------------------------------------------------------------
// 6. `satisfies` operator (TS 4.9+)
// ---------------------------------------------------------------------------

type Palette = Record<string, string | [number, number, number]>;

const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: [0, 0, 255],
} satisfies Palette;

palette.green.toUpperCase(); // green stays `string`
const _firstRed: number = palette.red[0]; // red stays tuple
void _firstRed;

// Canonical `as const satisfies` pattern
const routes = {
  home: '/',
  user: '/user/:id',
} as const satisfies Record<string, `/${string}`>;
void routes.home; // type: "/"

// ---------------------------------------------------------------------------
// 7. Conditional types + infer + distribution
// ---------------------------------------------------------------------------

type IsString<T> = T extends string ? true : false;
type _A = IsString<'hi'>; // true
type _B = IsString<42>; // false

type ElementType<T> = T extends (infer U)[] ? U : never;
type _Elem = ElementType<number[]>; // number

type Wrap<T> = T extends any ? T[] : never;
type _W = Wrap<string | number>; // string[] | number[]

type Wrap2<T> = [T] extends [any] ? T[] : never;
type _W2 = Wrap2<string | number>; // (string | number)[]

// ---------------------------------------------------------------------------
// 8. Mapped types + key remapping
// ---------------------------------------------------------------------------

type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type RequiredAll<T> = { [K in keyof T]-?: T[K] };

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type UserGetters = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }
const userGetters: UserGetters = {
  getName: () => 'x',
  getAge: () => 0,
};
void userGetters;

// Filter keys by value type
type StringKeys<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
type _SK = StringKeys<{ id: string; age: number; name: string }>; // { id: string; name: string }

// ---------------------------------------------------------------------------
// 9. Template literal types
// ---------------------------------------------------------------------------

type EventName = `on${Capitalize<'click' | 'hover'>}`;
const ev: EventName = 'onClick';
void ev;

type Split<S extends string, D extends string> = S extends `${infer Head}${D}${infer Tail}`
  ? [Head, ...Split<Tail, D>]
  : [S];
type Parts = Split<'a.b.c', '.'>; // ["a", "b", "c"]
const parts: Parts = ['a', 'b', 'c'];
void parts;

// ---------------------------------------------------------------------------
// 10. NoInfer<T> (TS 5.4+)
// ---------------------------------------------------------------------------

function createState<T>(initial: T, fallback: NoInfer<T>): T {
  return initial ?? fallback;
}

createState<'on' | 'off'>('on', 'off'); // ✅
// createState<'on' | 'off'>('on', 'pause'); // ❌ would not compile

// ---------------------------------------------------------------------------
// 11. Branded (nominal) types
// ---------------------------------------------------------------------------

type UserId = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

const asUserId = (s: string): UserId => s as UserId;
const asOrderId = (s: string): OrderId => s as OrderId;

function loadUser(_id: UserId) {}

loadUser(asUserId('u_1'));
// loadUser(asOrderId('o_1')); // ❌ Argument of type 'OrderId' is not assignable to parameter of type 'UserId'

// ---------------------------------------------------------------------------
// 12. Unknown at boundaries
// ---------------------------------------------------------------------------

function isUser(x: unknown): x is User {
  return (
    typeof x === 'object' &&
    x !== null &&
    'id' in x &&
    'name' in x &&
    'age' in x &&
    typeof (x as User).id === 'string' &&
    typeof (x as User).name === 'string' &&
    typeof (x as User).age === 'number'
  );
}

async function fetchUser(id: string): Promise<User> {
  const raw: unknown = await fetch(`/users/${id}`).then((r) => r.json());
  if (!isUser(raw)) throw new Error('bad payload');
  return raw;
}
void fetchUser;

// ---------------------------------------------------------------------------
// 13. Index signatures, function overloads, optional chaining, ?? operator
// ---------------------------------------------------------------------------

interface ErrorBag {
  [field: string]: string;
}
const errors: ErrorBag = { email: 'invalid', username: 'too short' };
void errors;

function combine(x: number, y: number): number;
function combine(x: string, y: string): string;
function combine(x: any, y: any): any {
  return x + y;
}
const sum: number = combine(1, 2);
const greeting: string = combine('hi ', 'there');
void sum;
void greeting;

const fetchedUserData: { id: string; name: string; job?: { title: string; description: string } } = {
  id: 'u1',
  name: 'Max',
};
void fetchedUserData?.job?.title; // undefined safely

const userInput: string | null | undefined = null;
const stored = userInput ?? 'DEFAULT';
void stored;
