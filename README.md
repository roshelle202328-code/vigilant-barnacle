# FactuFlow

> Modern multi-country electronic invoicing SaaS for Latin American SMEs.

FactuFlow centralizes billing, inventory, purchasing, clients, and financial reporting in one platform. An AI assistant accelerates workflows — creating quotes from natural language, extracting data from invoice PDFs/images, detecting late payers, and generating financial summaries.

## Architecture

FactuFlow follows **Clean Architecture**, **Domain-Driven Design**, and **CQRS** patterns. The monorepo is managed with **Turborepo + pnpm workspaces**.

See [`/docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full architecture overview.

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0 (install: `npm install -g pnpm@9.5.0`)
- **Docker** & **Docker Compose** (for local development services)

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url> && cd factuflow

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env

# 4. Start infrastructure services (PostgreSQL, Redis, MinIO, Mailhog)
pnpm run docker:up

# 5. Generate Prisma client and run migrations
pnpm run db:generate
pnpm run db:migrate

# 6. Start development servers
pnpm run dev
```

The API runs at [http://localhost:3001](http://localhost:3001) and the web app at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
factuflow/
├── apps/
│   ├── api/          # NestJS Backend (port 3001)
│   └── web/          # Next.js Frontend (port 3000)
├── packages/
│   ├── database/     # Prisma schema, migrations, seeds
│   ├── shared/       # Shared types, DTOs, constants, validators
│   ├── eslint-config/# Shared ESLint configuration
│   └── tsconfig/     # Shared TypeScript configuration
├── docker/           # Dockerfiles and Nginx config
├── docs/             # Architecture, domain model, ADRs
├── scripts/          # Utility scripts
└── .github/          # CI/CD workflows
```

## Available Scripts

| Command | Description |
|---|---|
| `pnpm run dev` | Start all apps in development mode |
| `pnpm run build` | Build all apps and packages |
| `pnpm run lint` | Run ESLint across all packages |
| `pnpm run test` | Run unit tests |
| `pnpm run type-check` | Run TypeScript type checking |
| `pnpm run db:migrate` | Run Prisma migrations |
| `pnpm run db:generate` | Generate Prisma client |
| `pnpm run db:studio` | Open Prisma Studio |
| `pnpm run docker:up` | Start PostgreSQL, Redis, MinIO, Mailhog |
| `pnpm run docker:down` | Stop all Docker services |
| `pnpm run format` | Format code with Prettier |

## Services (Docker)

| Service | Port | Description |
|---|---|---|
| PostgreSQL 16 | 5432 | Primary database |
| Redis 7 | 6379 | Cache, sessions, queues |
| MinIO | 9000/9001 | S3-compatible storage |
| Mailhog | 1025/8025 | Email testing |

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TailwindCSS + shadcn/ui |
| Backend | NestJS 10 + SWC |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Cache/Queues | Redis 7 |
| Storage | MinIO (dev) / S3 (prod) |
| Monorepo | Turborepo + pnpm workspaces |
| CI/CD | GitHub Actions |

## Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Domain Model](./docs/DOMAIN-MODEL.md)
- [Database Schema](./docs/DATABASE-SCHEMA.md)
- [Folder Structure](./docs/FOLDER-STRUCTURE.md)
- [Roadmap](./docs/ROADMAP.md)
- [Architecture Decision Records](./docs/adr/)

## License

Proprietary — All rights reserved.
