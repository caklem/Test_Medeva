# AGENTS.md — Test-Medeva (Medeva clinic management)

## Project structure

Two **independent** packages (root `package.json` is empty — NOT an npm workspaces monorepo):

- `frontend/` — React 19 + Vite 8 + TailwindCSS 3, **ESM** (`"type": "module"`)
- `backend/` — Express 5, **CommonJS** (`require`/`module.exports`)

Each has its own `package.json`, `node_modules/`, and lockfile.

## Commands

| Directory | Command | What it does |
|-----------|---------|-------------|
| `backend/` | `npm run dev` | Start Express on `:3000` with nodemon |
| `frontend/` | `npm run dev` | Start Vite dev server (default `:5173`) |
| `frontend/` | `npm run build` | Production build |
| `frontend/` | `npm run lint` | ESLint v10 (flat config, no Prettier) |

No test framework, no typechecking, no formatter, no CI, no Docker.

## Architecture facts

- **Data is in-memory arrays** (`backend/data/`) — resets on every restart. No database.
- **JWT secret**: `medeva_secret_key` (hardcoded in `backend/.env`, committed).
- **API base URL**: Hardcoded `http://localhost:3000/api` in `frontend/src/services/api.js` and occasionally inlined.
- **Path alias**: `@` → `src/` (Vite config — use for imports like `@/components/ui/button`).
- **Auth**: Two hardcoded users — `admin/123456` (role: admin), `user/123456` (role: user).
- `.gitignore` only exists in `frontend/` — no root-level gitignore.

## Known issues (agent, don't recreate)

1. **`frontend/src/pages/Categories.jsx`** has ~580 lines of duplicate/dead JSX appended after the real component (lines 442–1021). The real render is lines 87–437.
2. **Login form** collects `klinikId` but it is never sent to the API.
3. **`bcryptjs` in `backend/package.json` is unused** — passwords stored in plaintext.
4. **No env-based API URL** — the frontend hardcodes `localhost:3000`.

## Style / conventions

- Frontend: `import`/`export default`, JSX in `.jsx` files, ESLint v10 flat config in `eslint.config.js`.
- Backend: `require`/`module.exports`, plain `.js` files, `dotenv` loaded in `app.js:3`.
- Tailwind classes are the primary styling tool; a single custom CSS file (`Categories.css`, 686 lines) also exists.
- No TypeScript anywhere.
