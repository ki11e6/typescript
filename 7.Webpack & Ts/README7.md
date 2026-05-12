# Bundlers and TypeScript

### Useful Resources

- [Webpack docs](https://webpack.js.org/)
- [Vite docs](https://vite.dev/) · [Rspack docs](https://rspack.rs/) · [Rollup docs](https://rollupjs.org/)
- [esbuild docs](https://esbuild.github.io/) · [swc docs](https://swc.rs/) · [Turbopack docs](https://turbo.build/pack)

### What a bundler does

A bundler reads your source modules, follows the import graph, and emits one (or a few) output files plus assets. The original motivation — reducing HTTP request count under HTTP/1.1 — is much weaker today with HTTP/2 multiplexing and native ESM in browsers, but bundlers still pay for themselves through:

- **Tree-shaking** (dead-code elimination)
- **Code-splitting** and **lazy-loading** routes/components
- **TS, JSX, MDX, CSS/Sass/Tailwind transforms** in one pipeline
- **Asset hashing**, content-based caching, and gzip/brotli for production
- **Dev server with HMR** for fast feedback loops

|                "Normal" Setup                 |                With a bundler                 |
| :-------------------------------------------: | :-------------------------------------------: |
|     Multiple files served independently       |    Code bundles, split by route/feature       |
|       Unoptimized, full source size           | Minified, tree-shaken, content-hashed         |
| Manual TS compile + browser refresh           |       Dev server with sub-second HMR          |

The rest of this chapter shows Webpack for completeness (still common in legacy codebases), then surveys the **modern alternatives** you'd actually pick for a new project in 2026.

---

### Installing Webpack & Important Dependencies

We need to install first some **dev dependencies**.

```sh
yarn add webpack webpack-cli webpack-dev-server typescript ts-loader -D
```

---

### Adding Entry & Output Configuration

In `tsconfig.json` set `target: "ES2022"` (or whatever your minimum browser target supports — see [chapter 1](../1.Typscript%20base-I/README1.1.md#target--language-output)), `module: "ESNext"`, `moduleResolution: "bundler"`. You don't need `rootDir` — webpack defines the input graph from the `entry` setting.

Then create a `webpack.config.js`:

> **Note:** with `moduleResolution: "bundler"` you can drop the `.js` extension from local imports. Webpack's `resolve.extensions` (below) handles the lookup.

```js
const path = require('path');

module.exports = {
  entry: './src/app.ts', // what is the entry file
  output: {
    filename: 'bundle.js', // what is the name you want to give to the output file
    path: path.resolve(__dirname, 'dist'), // what is the ABSOLUTE path of your output file
  },
};
```

---

### Adding TypeScript Support with the ts-loader Package

`webpack.config.js`

```js
const path = require('path');

module.exports = {
  entry: './src/app.ts', // what is the entry file
  output: {
    filename: 'bundle.js', // what is the name you want to give to the output file
    path: path.resolve(__dirname, 'dist'), // what is the ABSOLUTE path of your output file
  },
  devtool: 'inline-source-map', // in tsconfig.json file, we have "sourceMap": true
  module: {
    // how to manage all the files
    rules: [
      // 1 rule per file type
      {
        test: /\.ts$/, // regex to match all the ts files
        use: 'ts-loader', // we use the ts-loader
        exclude: /node_modules/, // WE EXCLUDE node_modules
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // bundle all the ts and js files
  },
};
```

Then we need to add in `package.json`:

```json
"scripts": {
  "build": "webpack"
},
```

---

### Finishing the Setup & Adding webpack-dev-server

We need to add a `script` in `package.json`:

```json
"scripts": {
  "start": "webpack-dev-server",
  "build": "webpack"
},
```

Then we can add information to the `webpack.config.js` (the `publicPath`) and `devServer`.

```js
mode: 'development',
//...
output: {
  filename: 'bundle.js', // what is the name you want to give to the output file
  path: path.resolve(__dirname, 'dist'), // what is the ABSOLUTE path of your output file
  publicPath: 'dist', // important for the webpack-dev-server to understand where the output is written and where this is relative to the index HTML file
},
//...
devServer: {
  compress: true,
  port: 9000,
},
```

---

### Adding a Production Workflow

```sh
yarn add clean-webpack-plugin -D
```

`package.json`

```json
"scripts": {
  "start": "webpack-dev-server",
  "build": "webpack --config webpack.config.prod.js"
},
```

`webpack.config.prod.js`

```js
const path = require('path');
// clean-webpack-plugin v2+ is a named export — destructure it.
// See https://github.com/johnagan/clean-webpack-plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // Webpack 5.20+ has built-in cleaning — usually you can drop the plugin entirely.
    // https://webpack.js.org/configuration/output/#outputclean
    clean: true,
  },
  // Webpack 5: use `false` to disable source maps; the string 'none' is invalid.
  // https://webpack.js.org/configuration/devtool/
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [new CleanWebpackPlugin()],
};
```

> **Note (Webpack 5+):** `output.clean: true` replaces `clean-webpack-plugin` for most use cases — only include the plugin if you need its advanced glob/dry-run options.

> **Webpack itself in 2026**: Webpack 5 is still actively maintained under the OpenJS Foundation, and the [Webpack 2026 Roadmap](https://webpack.js.org/blog/2026-02-04-roadmap-2026/) lays out the path to v6 (native TypeScript transpilation without `ts-loader`, native CSS, a `universal` target for Node/web/Bun/Deno, multithreading). Existing Webpack 5 projects don't need to migrate, but new projects rarely start with Webpack today.

---

## Modern alternatives — what to pick for a new project

Bundling has been rewritten three times since Webpack was the default. As of 2026 the typical choice tree looks like this:

| You're building | Recommended |
|----------------|-------------|
| Single-page app (React/Vue/Svelte) | **Vite** |
| Next.js app | **Turbopack** (default since Next.js 16) |
| Library (ESM + CJS + `.d.ts`) | **tsdown** or **unbuild** |
| Drop-in Webpack replacement | **Rspack / Rsbuild** |
| Zero-config app | **Parcel v2** |
| Cloudflare Workers / Vercel Edge | **Vite**, **esbuild**, or framework default |
| Bun-only project | **`bun build`** |

The rest of this section covers each tool briefly with the TypeScript-relevant facts.

### Vite

[Vite](https://vite.dev/) (Evan You, 2020). Currently v6 (released **November 26, 2024**). Uses **esbuild** for dev / dependency pre-bundling and **Rollup** for production. Vite 7/8 are migrating to **Rolldown** as the unified bundler.

```sh
pnpm create vite@latest my-app --template react-ts
```

TypeScript notes:
- **Does not type-check by default** — Vite uses esbuild, which strips types as comments. Type-check separately with `tsc --noEmit` in CI, or run [`vite-plugin-checker`](https://vite-plugin-checker.netlify.app/) for in-editor errors.
- `tsconfig.json` should have `moduleResolution: "bundler"`, `module: "ESNext"`, `isolatedModules: true`, `noEmit: true`.

### esbuild

[esbuild](https://esbuild.github.io/) is a Go-based bundler/transpiler — easily 10–100× faster than `tsc`/Babel/webpack. Used internally by Vite, tsup, tsx, Astro, …

> Per the official FAQ: "esbuild does not do any type checking, so you will still need to run `tsc -noEmit` in parallel with esbuild."

Use it directly if you want a tiny, fast tool with minimal config; pick Vite for an SPA workflow on top.

### swc

[swc](https://swc.rs/) — Rust transpiler maintained by Vercel. Replaced Babel as the default in **Next.js** since v12, and Terser for minification. `@swc/cli` can act as a JS/TS transpiler; **`swc-node`** is a Node `--loader` for TS, not a full bundler.

Type-checking: an STC project ([stc.dudy.dev](https://stc.dudy.dev/)) is building a Rust port of the TypeScript checker but is still pre-production as of 2026.

### Rollup

[Rollup](https://rollupjs.org/) — still the gold standard for **library** bundling. Excellent tree-shaking, clean ESM output, plugin ecosystem covering TS, JSON, CommonJS interop, terser, etc. Latest stable: Rollup 4.x.

For libraries you usually don't write Rollup configs by hand any more — use `tsdown` or `unbuild` (below) for zero-config wrappers.

### tsdown (replacing tsup)

`tsup` wrapped esbuild for zero-config TS library bundling and was the de facto choice from ~2021 to 2024. In 2026 the recommended successor is **[tsdown](https://tsdown.dev/)**, by the Vite/Rolldown team, built on Rolldown. Same shape (zero config, ESM+CJS, `.d.ts` via API extractor), faster, actively developed.

```sh
pnpm add -D tsdown
```

```jsonc
// tsdown.config.ts (example)
import { defineConfig } from 'tsdown';
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true
});
```

### unbuild

[unbuild](https://github.com/unjs/unbuild) — Rollup-based, zero-config; used by **Nuxt** and the UnJS ecosystem. Notable for **stub mode** (no watcher needed in dev — exports point straight at the TS source). Picks ESM + CJS + `.d.ts` automatically from `package.json` `exports`/`main`/`module`/`types`.

### Turbopack

[Turbopack](https://turbo.build/pack) — Vercel's Rust bundler. **Stable in dev** since Next.js 15 (Oct 2024). **Default for both dev and production builds since Next.js 16** (Oct 2025). It's primarily a Next.js feature today; standalone use is possible but less polished than Vite/Rspack.

### Rspack and Rsbuild

[Rspack](https://rspack.rs/) — ByteDance's Rust port of the Webpack architecture, 1.0 GA, **~85% Webpack-plugin compatibility**, used at Microsoft/Amazon/Discord. Great if you have a legacy Webpack project and want the speed-up without a config rewrite.

[Rsbuild](https://rsbuild.rs/) — the higher-level convention-over-configuration tool on top of Rspack (analogous to Vite-on-Rollup, but webpack-compatible).

### Parcel v2

[Parcel v2](https://parceljs.org/) — still maintained (2.16.x in early 2026). Zero-config, handles TS/CSS/Sass/MDX out of the box. Mindshare has shifted to Vite/Rspack, but Parcel remains a valid choice for small apps that need *truly* zero config.

### Bun build

[`bun build`](https://bun.com/docs/bundler) — Bun ships a built-in bundler that handles JS, TS, JSX, CSS. Fast and zero-install on Bun. **Caveat:** does **not** emit `.d.ts` declarations (see [Bun #5141](https://github.com/oven-sh/bun/issues/5141)) — you still need `tsc` or [bunup/dts](https://github.com/bunup/dts) to ship a typed library.

```sh
bun build ./src/index.ts --outdir dist --target browser --minify
```

### Type-check vs bundle — they're separate jobs

Most modern bundlers (esbuild, swc, tsx, Vite, tsdown, Bun, Parcel) **strip TS types instead of type-checking them**. That's why they're so fast. Run `tsc --noEmit` as a separate step (CI, pre-commit, or `vite-plugin-checker` in dev):

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "typecheck": "tsc --noEmit"
  }
}
```

This split is the modern norm — `ts-loader`/`ts-node` doing both bundling and type-checking in one pass is the *old* pattern.
