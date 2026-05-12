# The TypeScript Compiler and `tsconfig.json`

This chapter covers compiler invocation, the most important `tsconfig.json` options, and recommended modern defaults (TypeScript 5.x, 2026).

### Useful Resources

- [TSConfig Reference](https://www.typescriptlang.org/tsconfig/) — the canonical option list
- [TS Handbook — TSConfig basics](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [Compiler options on the CLI](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Node.js: TypeScript support](https://nodejs.org/api/typescript.html)

---

## Running the compiler

```sh
npx tsc app.ts          # one file
npx tsc --watch         # watch all files in tsconfig.json
npx tsc                 # build all files according to tsconfig.json
npx tsc -b              # project-references build mode (monorepos)
npx tsc --init          # generate a starter tsconfig.json
```

> Most modern projects don't run `tsc` for emitting JS — Vite/esbuild/swc handle that. They run `tsc --noEmit` only for type-checking.

For tiny scripts you can skip `tsc` entirely:
- **Node 22.6+**: `node --experimental-strip-types script.ts` runs TS by stripping types.
- **Node 23.6+**: stripping is on by default, no flag.
- **Bun / Deno**: run `.ts` files natively.
- **`tsx`**: a popular CLI that wraps esbuild for instant TS execution: `tsx script.ts`.

---

## A modern starter `tsconfig.json`

This is what `tsc --init` produces in TS 5.x (paraphrased and trimmed). Each line is annotated.

```jsonc
{
  "compilerOptions": {
    // Language target. ES2022 is a safe default for Node 18+ and modern browsers.
    // Use ESNext only if you control the runtime fully.
    "target": "ES2022",

    // Emit module format. Pair with moduleResolution below.
    //   "nodenext" — Node ESM/CJS, respects package.json "exports"
    //   "esnext"   — bundlers (Vite, webpack, esbuild) — paired with moduleResolution: "bundler"
    "module": "ESNext",

    // How to resolve `import 'x'`. Five values exist:
    //   "classic"  — legacy, never use
    //   "node10"   — being deprecated (was "node"); TS still accepts it
    //   "node16"   — Node ESM/CJS rules pinned to Node 16 semantics
    //   "nodenext" — same, tracking the latest Node release
    //   "bundler"  — for Vite/webpack/esbuild; pairs with module: "esnext" or "preserve"
    "moduleResolution": "bundler",

    // The lib types the compiler knows about. Defaults follow `target` but can be overridden.
    "lib": ["ES2022", "DOM", "DOM.Iterable"],

    "jsx": "react-jsx",                // for React projects on the automatic JSX runtime
    "useDefineForClassFields": true,   // default since 4.7 when target >= ES2022

    // ----- type checking -----
    "strict": true,                    // turns on the family below (see § Strict)
    "noUncheckedIndexedAccess": true,  // arr[i] is T | undefined — catches index bugs
    "exactOptionalPropertyTypes": true,// {a?: string} forbids explicit `: undefined`
    "noImplicitOverride": true,        // require `override` keyword on subclass overrides
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,

    // ----- modules/emit ergonomics -----
    "esModuleInterop": true,           // sane CJS default-import semantics
    "allowSyntheticDefaultImports": true,
    "verbatimModuleSyntax": true,      // TS 5.0+ — supersedes importsNotUsedAsValues + preserveValueImports
    "isolatedModules": true,           // safe for single-file transpilers
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,              // skip checking node_modules .d.ts; recommended

    // ----- emit -----
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    "declaration": true,               // emit .d.ts alongside .js for libraries
    "noEmit": false,                   // set true when a bundler does emit

    // ----- incremental -----
    "incremental": true                // cache compile results in .tsbuildinfo
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## `target` — language output

`target` controls what JavaScript syntax the compiler emits. Pick the **lowest** runtime you must support:

| Runtime | Target |
|---------|--------|
| Node 18+ | `ES2022` |
| Node 20+ | `ES2023` |
| Last-2 evergreen browsers | `ES2022` |
| IE11 (rare today) | `ES5` |
| Bundler picks the down-level | `ESNext` |

`ES5` (the old `tsc --init` default) is now legacy and forces `tsc` to polyfill things like `class`, `async/await`, optional chaining. Avoid it unless you really need it.

---

## `module` × `moduleResolution`

These two work as a pair. Common combinations:

| Use case | `module` | `moduleResolution` |
|---------|---------|--------------------|
| Vite/webpack/esbuild app | `ESNext` (or `Preserve`) | `bundler` |
| Modern Node ESM library | `NodeNext` | `NodeNext` |
| Modern Node CJS library | `NodeNext` | `NodeNext` (TS infers based on `package.json "type"`) |
| Legacy CommonJS Node app | `CommonJS` | `Node10` |

`bundler` only works with `module: "esnext"` or `"preserve"` — TS rejects other combinations.

---

## Strict mode breakdown (TS 5.6+)

`"strict": true` enables the following family:

- `alwaysStrict` — emit `"use strict"`
- `noImplicitAny`
- `noImplicitThis`
- `strictBindCallApply`
- `strictBuiltinIteratorReturn` *(TS 5.6+)*
- `strictFunctionTypes`
- `strictNullChecks`
- `strictPropertyInitialization`
- `useUnknownInCatchVariables` *(TS 4.4+)*

The set grows over time — always check the [TSConfig Reference](https://www.typescriptlang.org/tsconfig/#strict) for your version.

### Extra strict-ish flags worth turning on

- **`noUncheckedIndexedAccess`** — `arr[i]` becomes `T | undefined`. Catches off-by-one and missing-key bugs that `strict` lets through.
- **`exactOptionalPropertyTypes`** — `{ a?: string }` means "may be missing OR exactly `string`" — assigning `undefined` is rejected. Tightens optional-property semantics.
- **`noImplicitOverride`** — subclass methods must use the `override` keyword.
- **`noPropertyAccessFromIndexSignature`** — forces `obj['x']` (bracket) instead of `obj.x` (dot) for index-signature reads.

None of these are in `strict`; you opt in.

---

## `verbatimModuleSyntax` (TS 5.0)

Replaces `importsNotUsedAsValues` and `preserveValueImports`. With it on:

- An import or export **without** `type` is preserved verbatim in emit.
- An import or export **with** `type` is erased entirely.

```ts
import type { User } from './user';   // erased
import { db } from './db';            // kept
export type { Result } from './result'; // erased
```

This makes single-file transpilers (esbuild, swc, Babel) behave the same as `tsc` for module syntax.

---

## `isolatedModules`

Required (or strongly recommended) for any pipeline that processes files independently — Vite, esbuild, swc, Babel, native Node stripping. It bans constructs that need cross-file knowledge:

- References to `const enum` members declared in another file.
- Non-module files that use `namespace` for values.
- Re-exporting types without `export type` (when paired with `verbatimModuleSyntax`).

---

## `erasableSyntaxOnly` (TS 5.8)

Goes a step further than `isolatedModules` — bans constructs that **can't be erased to plain JS** at all:

- `enum`
- `namespace` with values
- `class` parameter properties (`constructor(public x: number)`)
- `import =` / `export =`

This is the flag you turn on if you want your code to run under Node's `--experimental-strip-types`. The trade-off: you give up some TS-specific runtime features.

---

## `rewriteRelativeImportExtensions` (TS 5.7)

Rewrites `.ts`/`.tsx`/`.mts`/`.cts` to `.js`/`.jsx`/`.mjs`/`.cjs` in **relative** imports at emit time. Useful when:

- You want to write `import x from './foo.ts'` (which Node's native TS support wants) but emit valid JS.
- You target Bun/Deno + Node from the same source.

Works regardless of `module` setting.

---

## `useDefineForClassFields`

Default `true` when `target >= ES2022` (since TS 4.7). Aligns class-field semantics with the ECMAScript spec — fields are defined with `[[Define]]`, not `[[Set]]`. Mostly invisible unless you have subclass-getter/setter chains.

Required `true` if you use [Stage-3 decorators](../6.Decorators/README6.md).

---

## `incremental` and project references

```jsonc
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo"   // optional — TS picks a sensible default if omitted
  }
}
```

`incremental` writes `.tsbuildinfo` on disk so subsequent `tsc` runs only recheck what changed. Speed up further with **project references**:

```jsonc
// tsconfig.json (root)
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/web" }
  ]
}
```

Each referenced project gets `"composite": true` and is built with `tsc -b`. Real monorepos can move from minutes to seconds with this layout.

---

## `include` / `exclude` / `files`

- `include` — globs of files to compile (default `**/*` if absent).
- `exclude` — globs to skip. `node_modules`, `bower_components`, `jspm_packages`, and `outDir` are excluded by default.
- `files` — explicit list, no globs.

If you specify `include`, you must include **every** entry you want.

```jsonc
{
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "**/*.stories.tsx"]
}
```

---

## Source maps

```jsonc
{
  "compilerOptions": {
    "sourceMap": true,             // emit .js.map files
    "inlineSourceMap": false,      // or fold them into the .js (avoid in production)
    "inlineSources": false,        // embed TS source in the map
    "declarationMap": true         // .d.ts.map — lets editors jump to .ts from .d.ts
  }
}
```

`sourceMap` plus a debugger (Chrome devtools, VS Code, JetBrains) lets you set breakpoints directly in `.ts` files.

---

## Stop emitting on errors

```jsonc
{ "compilerOptions": { "noEmitOnError": true } }
```

Default is `false` — TS will emit JS even when there are type errors. Set `true` to keep broken JS out of your `dist/`.

---

## Quality-of-life flags

```jsonc
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

These are not part of `strict` but most teams turn them on.

---

## Debugging TS in VS Code

For a Node script:

```jsonc
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Run script with tsx",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/tsx",
      "program": "${workspaceFolder}/src/index.ts",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

For a Vite app: just use the **JavaScript Debugger** built into VS Code with the browser. With `sourceMap: true` in your tsconfig, breakpoints in `.ts(x)` files work directly.

---

## Reference: minimal `tsconfig.json` per project type

### Vite + React + TS

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "useDefineForClassFields": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

### Node 22+ library (ESM, NodeNext)

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

### Script run by `node --experimental-strip-types`

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  }
}
```
