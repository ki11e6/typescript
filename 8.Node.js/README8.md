# Node.js + TypeScript

Running and writing typed Node servers in 2026. Covers Express 5, Fastify, and Hono with TypeScript, plus the modern ways to actually execute `.ts` files.

### Useful Resources

- [Express docs](https://expressjs.com/) · [Express 5 release post](https://expressjs.com/2024/10/15/v5-release.html)
- [Fastify TypeScript reference](https://fastify.dev/docs/latest/Reference/TypeScript/)
- [Hono docs](https://hono.dev/docs)
- [Node.js: TypeScript support](https://nodejs.org/api/typescript.html)
- [tsx CLI](https://tsx.is/)

---

## Running `.ts` files in Node — 2026 options

| Tool | When to use | Caveats |
|------|-------------|---------|
| **Node 22.6+ `--experimental-strip-types`** | Quick scripts, no enums/namespaces | Strips only; no enum/parameter-property support unless `--experimental-transform-types` (22.7+). |
| **Node 23.6+ (default)** | Same, no flag needed | Production-ready by 24.x. |
| **`tsx`** | Anything dev-time — `npx tsx script.ts`, `tsx watch src/` | Doesn't type-check; run `tsc --noEmit` separately. |
| **`ts-node`** | Older codebases that already use it | Maintenance mode; consider migrating to `tsx`. |
| **`tsc -w` + `nodemon`** | Legacy | Slower; modern alternatives are simpler. |

Recommended in 2026: **`tsx`** for development, native Node strip-types in deploy environments where you can require Node ≥ 22.6.

```sh
# zero-config TS execution
npx tsx src/index.ts

# watch mode
npx tsx watch src/index.ts

# Node 22.6+
node --experimental-strip-types src/index.ts

# Node 22.7+ — handles enums and parameter properties too
node --experimental-transform-types src/index.ts

# Node 23.6+ — no flag
node src/index.ts
```

Type-check in a separate CI step or pre-commit hook:

```sh
npx tsc --noEmit
```

---

## Express 5 + TypeScript

Express **v5.0** shipped October 15, 2024. The most useful change for TS developers: **rejected promises in route handlers are automatically forwarded to error middleware**, so you can write `async` handlers without try/catch boilerplate.

### Setup

```sh
pnpm add express
pnpm add -D @types/express @types/node typescript tsx
```

Project structure:

```
src/
  app.ts
  routes/todos.ts
  controllers/todos.ts
  models/todo.ts
package.json
tsconfig.json
```

`package.json` scripts:

```jsonc
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "typecheck": "tsc --noEmit"
  }
}
```

`tsconfig.json` — see [the Node ESM template in chapter 1](../1.Typscript%20base-I/README1.1.md#node-22-library-esm-nodenext). Key bits: `module: "NodeNext"`, `moduleResolution: "NodeNext"`, `target: "ES2022"`, `strict: true`.

> Under `nodenext`, relative imports must use the **runtime** extension (`.js`), not `.ts` — because that's what they will be after compilation, and Node's ESM resolver requires explicit extensions. Either write `import x from './routes/todos.js'`, or set `rewriteRelativeImportExtensions: true` (TS 5.7) to let TS rewrite `.ts` to `.js` at emit.

### `app.ts`

```ts
import express, { type Request, type Response, type NextFunction } from 'express';
import todoRoutes from './routes/todos.js';

const app = express();

// Built-in body parsers — express.json() and express.urlencoded() ship
// with Express since v4.16 (2016). No need to install body-parser.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/todos', todoRoutes);

// Error-handling middleware — must have FOUR params for Express to recognise it.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000, () => console.log('http://localhost:3000'));
```

### Controllers — typing `req.body` properly

`RequestHandler` has five generic parameters: `<Params, ResBody, ReqBody, ReqQuery, Locals>`.

```ts
// controllers/todos.ts
import type { RequestHandler } from 'express';
import { Todo } from '../models/todo.js';

const TODOS: Todo[] = [];

type CreateTodoParams = Record<string, never>;
type CreateTodoBody   = { text: string };
type CreateTodoResp   = { message: string; createdTodo: Todo };

export const createTodo: RequestHandler<
  CreateTodoParams,
  CreateTodoResp,
  CreateTodoBody
> = (req, res) => {
  // req.body is now `CreateTodoBody` — no `as` cast needed
  const newTodo = new Todo(crypto.randomUUID(), req.body.text);
  TODOS.push(newTodo);
  res.status(201).json({ message: 'Created.', createdTodo: newTodo });
};
```

### Routes

```ts
// routes/todos.ts
import { Router } from 'express';
import { createTodo } from '../controllers/todos.js';

const router = Router();
router.post('/', createTodo);
router.get('/', (_req, res) => res.json([]));
router.patch('/:id', (_req, res) => res.json({}));
router.delete('/:id', (_req, res) => res.json({}));
export default router;
```

### Async error forwarding (Express 5)

```ts
// In Express 5 this Just Works — the rejection reaches the error middleware.
router.get('/', async (_req, _res) => {
  throw new Error('boom');
});
```

In Express 4 you had to wrap every handler in `try/catch` or `express-async-errors`.

### Runtime validation with Zod

`@types/express` only types your function signatures — it doesn't validate the actual request body. Pair Express with a schema validator at the boundary.

```ts
import { z } from 'zod';

const CreateTodo = z.object({ text: z.string().min(1) });
type CreateTodoBody = z.infer<typeof CreateTodo>;

router.post('/', (req, res) => {
  const parsed = CreateTodo.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() });
  // parsed.data is fully typed `CreateTodoBody`
  res.status(201).json({ ok: true, data: parsed.data });
});
```

Alternatives: **valibot** (smaller bundles), **arktype** (faster).

---

## Fastify — typed alternatives

[Fastify](https://fastify.dev) is significantly faster than Express and has first-class TS support through route generics.

```sh
pnpm add fastify
pnpm add -D @types/node typescript tsx
```

```ts
// src/server.ts
import Fastify, { type FastifyRequest } from 'fastify';

const app = Fastify({ logger: true });

type CreateTodo = {
  Body: { text: string };
  Params: { id: string };
  Querystring: { limit?: number };
};

app.post<CreateTodo>('/todos', (req, reply) => {
  // req.body is { text: string }, req.params is { id: string }, etc.
  reply.code(201).send({ id: 't1', text: req.body.text });
});

app.listen({ port: 3000 });
```

The full `RouteGenericInterface` accepts `Body`, `Querystring`, `Params`, `Headers`, `Reply` — you can subset as needed.

For runtime validation, Fastify integrates with JSON-Schema-style validators (Ajv, TypeBox) directly — supplying the schema validates AND types the request in one step. See the [TypeBox + Fastify recipe](https://fastify.dev/docs/latest/Reference/TypeScript/#json-schema).

---

## Hono — edge-first, multi-runtime

[Hono](https://hono.dev) (created December 2021) runs on **Node, Bun, Deno, Cloudflare Workers, Vercel, AWS Lambda**. Its type system **infers route param/query types from the path string**, which makes it a great fit for type-safe RPC.

```sh
pnpm add hono @hono/node-server
pnpm add -D @types/node typescript tsx
```

```ts
// src/server.ts
import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/todos/:id', (c) => {
  const id = c.req.param('id');   // typed as string from the path pattern
  return c.json({ id, text: 'demo' });
});

app.post('/todos', async (c) => {
  const body = await c.req.json<{ text: string }>();
  return c.json({ id: '1', text: body.text }, 201);
});

serve({ fetch: app.fetch, port: 3000 });
```

If you keep your route calls **chained** (`app.get(…).post(…).put(…)`), you can feed the resulting type into Hono's RPC client (`hc`) and get a typed fetch client for free — without code generation.

---

## ESM in Node — TS-specific things to know

1. Set `"type": "module"` in `package.json` and `module`/`moduleResolution: "NodeNext"` in tsconfig.
2. Relative imports include the runtime extension: `import x from './foo.js'` (even though the source file is `foo.ts`).
3. Use `import.meta.url` and `node:url`'s `fileURLToPath` to recover `__dirname`/`__filename` equivalents.
4. `import.meta.dirname` and `import.meta.filename` shortcuts exist in **Node 20.11+** / **Node 22**.

```ts
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// Node 20.11+ shortcut:
console.log(import.meta.dirname);
```

---

## Production build vs dev-time TS

Two valid paths:

### A. Compile to JS in CI, deploy JS

```sh
tsc
node dist/app.js
```

Predictable, no TS at runtime. Standard for production Docker images.

### B. Run TS directly (Node 22.6+ / Bun / Deno)

```sh
node --experimental-strip-types src/app.ts
```

Faster cold start (no compile step), but requires the runtime to support TS, and you give up some TS features unless you also enable `--experimental-transform-types`. Combine with `erasableSyntaxOnly` in tsconfig (TS 5.8) so the compiler errors out on anything that can't be erased.

For most production deployments today, **option A is still the safe choice**; option B is gaining adoption for serverless and edge runtimes.

---

## Quick gotchas

- **Don't install `@types/express` as a runtime dependency** — it's `devDependencies` only. Same for `@types/node`.
- **`--save` is a no-op since npm 5** (it's the default). You don't need to pass it.
- **`req.body` is typed `any` unless you annotate** the handler with `RequestHandler<…, ReqBody>` or parse with Zod. Body type is *not* derived from middleware order.
- **For monorepos**, set the package's `tsconfig.json` to `composite: true` and the root `tsc -b` will build all packages in dependency order. See [chapter 1 §incremental + project references](../1.Typscript%20base-I/README1.1.md#incremental-and-project-references).
