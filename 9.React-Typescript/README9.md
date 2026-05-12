# React + TypeScript

Modern React (18/19) with TypeScript, using **Vite** as the build tool. CRA was deprecated in February 2025, so this chapter no longer uses it.

### Useful Resources

- [React — TypeScript guide](https://react.dev/learn/typescript)
- [React 19 release notes](https://react.dev/blog/2024/12/05/react-19)
- [Sunsetting Create React App](https://react.dev/blog/2025/02/14/sunsetting-create-react-app)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [`@types/react` (DefinitelyTyped)](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)

The `react/` folder in this chapter is a working Vite + React 18 + TS project. `cd react && pnpm install && pnpm dev` starts the dev server.

---

## Setting up a new project (Vite)

```sh
pnpm create vite my-app --template react-ts
cd my-app
pnpm install
pnpm dev
```

That gives you React 18+ (or 19, depending on the template version), TypeScript 5.x, `@types/react`, and a `tsconfig.app.json` already wired up.

Don't use Create React App — `react.dev` directs new apps to frameworks (Next.js, React Router v7) or to bundlers (Vite, RSBuild, Parcel).

---

## Typing function components

Annotate props directly on the function signature. Avoid `React.FC`:

```tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
};

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Why not `React.FC`?

- `@types/react` v18 removed the implicit `children` prop from `React.FC`, so it no longer behaves the way old tutorials describe.
- It interferes with generic components (you can't make a function generic when its type is `React.FC<…>`).
- It's less explicit than annotating the props on the signature.

react.dev examples use plain function annotation; the React TypeScript Cheatsheet also recommends against `React.FC`. Use it only if a codebase already standardises on it.

### Children: `React.ReactNode`

```tsx
type CardProps = {
  title: string;
  children: React.ReactNode;   // anything React can render
};

function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
```

### `JSX.Element` vs `ReactElement` vs `ReactNode`

| Type | What it accepts |
|------|-----------------|
| `JSX.Element` | The result of a single JSX expression — what a component returns. |
| `ReactElement<P>` | A typed JSX element with known props `P`. Use when you need to inspect the element. |
| `ReactNode` | The widest — anything renderable: `string`, `number`, `boolean`, `null`, `undefined`, `JSX.Element`, arrays of these. Use for `children` and "any renderable input." |

Rule of thumb: **props** type `children` as `ReactNode`; return types are usually inferred.

---

## Event types

```tsx
function Form() {
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data.get('name'));
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
  }

  function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    console.log(e.currentTarget.dataset.id);
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="name" onChange={onChange} />
      <button type="submit" onClick={onClick}>Submit</button>
    </form>
  );
}
```

Prefer `e.currentTarget` over `e.target` — it has the precise element type.

---

## `useState`

```tsx
const [count, setCount] = useState(0);                 // inferred: number
const [name, setName] = useState<string>('');          // explicit

// Pattern: null initial when you don't have a value yet
const [user, setUser] = useState<User | null>(null);
```

Functional setter narrows the previous value's type automatically:

```tsx
setCount(prev => prev + 1);
```

---

## `useReducer`

Type the state and the action union; let inference handle the rest.

```tsx
type State = { count: number };
type Action = { type: 'inc' } | { type: 'dec' } | { type: 'set'; value: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'inc': return { count: state.count + 1 };
    case 'dec': return { count: state.count - 1 };
    case 'set': return { count: action.value };
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return <button onClick={() => dispatch({ type: 'inc' })}>{state.count}</button>;
}
```

react.dev recommends inference over the older `useReducer<Reducer<State, Action>>(…)` generic form.

---

## `useRef`

Two flavours, depending on intent:

```tsx
// DOM ref — must initialise with null; non-null when attached
const inputRef = useRef<HTMLInputElement>(null);

// Mutable instance variable — type the box, no null
const renderCount = useRef(0);
renderCount.current += 1;
```

When you read `inputRef.current`, narrow rather than asserting:

```tsx
inputRef.current?.focus();    // safe
// inputRef.current!.focus(); // works, but loses you a check
```

---

## `useContext`

The common pattern: `null` default + a custom hook that throws if used outside the provider.

```tsx
type AuthCtx = { user: User; signOut(): void };
const AuthContext = createContext<AuthCtx | null>(null);

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth used outside <AuthProvider>');
  return ctx;
}
```

---

## `useEffect`, `useCallback`, `useMemo`

The hooks are inferred — annotate only the *values* they wrap.

```tsx
useEffect(() => {
  const id = setTimeout(() => console.log('tick'), 1000);
  return () => clearTimeout(id);
}, []);

const fetchUser = useCallback(
  (id: string): Promise<User> => fetch(`/users/${id}`).then(r => r.json()),
  []
);

const sorted = useMemo(() => [...items].sort(), [items]);
```

---

## Custom hooks — `as const` tuple return

Return a tuple from a custom hook with `as const` so the caller gets ordered, narrowly-typed positions instead of `(string | (() => void))[]`:

```tsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn(x => !x), []);
  return [on, toggle] as const;   // readonly [boolean, () => void]
}

const [open, toggle] = useToggle();
```

Equivalent alternative: annotate the return type explicitly: `: readonly [boolean, () => void]`.

---

## Extending native elements with `ComponentProps`

When you want a `<Button>` that accepts every native button prop **plus** your own:

```tsx
type ButtonProps = React.ComponentProps<'button'> & {
  variant: 'primary' | 'ghost';
};

function Button({ variant, className, ...rest }: ButtonProps) {
  return <button className={`btn-${variant} ${className ?? ''}`} {...rest} />;
}

<Button variant="primary" onClick={() => {}} disabled>Save</Button>;
```

For library-internal forwarding (no `ref`), use `React.ComponentPropsWithoutRef<'button'>` instead.

---

## Discriminated-union props

When a component has different *required* fields depending on a "kind" flag:

```tsx
type LinkProps =
  | { kind: 'internal'; to: string }
  | { kind: 'external'; href: string; target?: '_blank' };

function Link(props: LinkProps) {
  if (props.kind === 'internal') return <a href={props.to}>internal</a>;
  return <a href={props.href} target={props.target} rel="noreferrer">external</a>;
}
```

The compiler now forces every call site to provide a coherent prop set — no more `href` on an internal link.

---

## Generic components

Function components can be generic. Annotate props on the signature:

```tsx
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map((it, i) => <li key={i}>{renderItem(it)}</li>)}</ul>;
}

<List items={[1, 2, 3]} renderItem={(n) => n.toFixed(2)} />;
```

(`React.FC<…>` makes the function non-generic — another reason to avoid it.)

---

## React 19 features

> Requires `react@^19` + `react-dom@^19` + `@types/react@^19` + `@types/react-dom@^19`. The Vite project under `react/` is on React 18.3; bump versions before using these.

### `ref` as a regular prop — `forwardRef` no longer needed

```tsx
type InputProps = {
  ref?: React.Ref<HTMLInputElement>;
  placeholder?: string;
};

function TextInput({ ref, ...rest }: InputProps) {
  return <input ref={ref} {...rest} />;
}

// Caller:
const r = useRef<HTMLInputElement>(null);
<TextInput ref={r} placeholder="name" />;
```

`forwardRef` still works in React 19; it's slated for deprecation in a future release. New code shouldn't use it.

### `use(promise)` and `use(context)`

The `use` hook reads a promise (suspending the component) or a context — and it can be called inside `if`/loops, unlike other hooks.

```tsx
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise);    // suspends until resolved
  return <h1>{user.name}</h1>;
}
```

Rules:
- Must be called from a Component or Hook.
- Rejected promises can't be caught with `try/catch` — use an Error Boundary or `.catch()`.
- The promise must be **stable across renders** (cache it, pass it from a parent, or use a framework like Next.js that does it for you).

### Actions: `<form action={…}>`

Pass an async function as `action`; React runs it and clears the form on success.

```tsx
async function createTodo(formData: FormData) {
  const text = String(formData.get('text') ?? '');
  await fetch('/api/todos', { method: 'POST', body: JSON.stringify({ text }) });
}

function NewTodoForm() {
  return (
    <form action={createTodo}>
      <input name="text" />
      <button type="submit">Add</button>
    </form>
  );
}
```

### `useActionState(action, initialState, permalink?)`

Replaces `useFormState`. Returns `[state, dispatchAction, isPending]`.

```tsx
type FormState = { error?: string };

async function login(prev: FormState, fd: FormData): Promise<FormState> {
  const email = String(fd.get('email') ?? '');
  if (!email.includes('@')) return { error: 'Invalid email' };
  return {};
}

function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action}>
      <input name="email" />
      <button disabled={pending}>{pending ? '…' : 'Sign in'}</button>
      {state.error && <p>{state.error}</p>}
    </form>
  );
}
```

### `useOptimistic(state, reducer?)`

```tsx
type Todo = { id: string; text: string; pending?: boolean };

function Todos({ todos, addTodo }: { todos: Todo[]; addTodo(text: string): Promise<void> }) {
  const [optimistic, addOptimistic] = useOptimistic(
    todos,
    (state: Todo[], pending: string) =>
      [...state, { id: 'tmp', text: pending, pending: true }]
  );

  async function action(formData: FormData) {
    const text = String(formData.get('text') ?? '');
    addOptimistic(text);
    await addTodo(text);
  }

  return (
    <form action={action}>
      {optimistic.map(t => <div key={t.id}>{t.text}{t.pending && ' …'}</div>)}
      <input name="text" />
      <button>Add</button>
    </form>
  );
}
```

### `useFormStatus()`

Reads the **parent** `<form>`'s status — must be called from a child component, not from the component that renders the `<form>` itself.

```tsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? '…' : 'Save'}</button>;
}
```

---

## `tsconfig` for a React + Vite project

The template's defaults are already modern; the relevant pieces:

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",            // automatic JSX runtime — no need to import React
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "useDefineForClassFields": true,
    "isolatedModules": true,
    "noEmit": true,                // Vite handles the transpile
    "skipLibCheck": true
  }
}
```

With `jsx: react-jsx` (the automatic runtime, default since React 17), you don't need `import React from 'react'` at the top of every `.tsx` file.

---

## Routing / state libraries

- **React Router v6/v7** ships its own types; use the `Route`/`Link` props directly.
- **TanStack Query v5** infers types from your `queryFn` return.
- **Zustand**, **Redux Toolkit**, **Jotai** all have first-class TS support.
- For schema-validated forms, prefer **Zod** (or **valibot** / **arktype**) + **react-hook-form**.

You usually don't need `@types/...` packages for modern libraries — most ship their own types.
