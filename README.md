# Cosmic Mind

An interactive 3D/2D mindmap visualization for your Markdown knowledge vault. Nodes represent notes, edges represent `[[wikilinks]]` between them.

## Tech Stack

- **React 19** + **Vite 7**
- **Three.js** via `@react-three/fiber` — 3D rendering
- **SVG** — 2D rendering with force-directed layout
- **gray-matter** + **marked** — Markdown parsing

## Prerequisites
 
- Node.js 20+
- npm

---

## Development

### Option 1 — Local

```bash
# Install dependencies
npm install

# Start dev server with hot reload (http://localhost:5173)
npm run dev
```

### Option 2 — Docker (recommended)

Uses `Dockerfile.dev` + `docker-compose.dev.yml`. Source files are mounted as a volume so hot reload (HMR) works normally.

```bash
# Build and start
docker compose -f docker-compose.dev.yml up --build

# Stop
docker compose -f docker-compose.dev.yml down
```

Then visit `http://localhost:5173`.

To add or edit notes, place `.md` files in `src/vault/`. Wikilinks (`[[Note Title]]`) become edges in the graph.

---

## Production

### Option 1 — Vite preview (quick check)

```bash
npm run build
npm run preview
```

### Option 2 — Docker Compose (recommended)

The app is served by Nginx on port 80 inside the container. The compose setup expects an external Docker network named `caddy_net` (intended to sit behind a Caddy reverse proxy).

```bash
# Build and start
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down
```

#### Redeploy

```bash
git pull && docker compose build && docker compose up -d
```

If you're not using Caddy, expose port 80 directly by adding a `ports` entry to `docker-compose.yml`:

```yaml
services:
  cosmic_mind:
    ports:
      - "8080:80"
```

Then visit `http://localhost:8080`.

### Option 3 — Docker only (no Compose)

```bash
docker build -t cosmic-mind .
docker run -d -p 8080:80 --name cosmic-mind cosmic-mind
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (HMR) |
| `npm run build` | Build for production → `dist/` |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint |
