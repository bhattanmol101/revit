# Revit Monorepo

Cross-platform app monorepo built with Next.js, Expo, Tamagui, Solito, tRPC, Zustand, and Supabase.

## Stack

- Web: Next.js App Router in `apps/web`
- Mobile: Expo + Expo Router in `apps/mobile`
- Shared app logic: `packages/app`
- Shared UI kit: `packages/ui`
- Tamagui config: `packages/config`
- API layer: `packages/api`
- Database types and Supabase client: `packages/db`
- Local backend: Supabase CLI in `supabase`
- Monorepo orchestration: Yarn workspaces + Turbo

## Project Structure

```text
.
├── apps
│   ├── mobile              # Expo app
│   │   ├── app             # Expo Router routes
│   │   ├── assets          # Native assets
│   │   └── scripts         # Native helper scripts
│   └── web                 # Next.js app
│       ├── app             # App Router routes
│       ├── __tests__       # Vitest tests
│       ├── e2e             # Playwright tests
│       └── public          # Static assets
├── packages
│   ├── api                 # tRPC setup, auth store, schemas
│   ├── app                 # Shared screens, providers, feature logic
│   ├── config              # Tamagui theme and config
│   ├── db                  # Supabase client and generated DB types
│   └── ui                  # Shared UI components
├── supabase
│   ├── config.toml         # Local Supabase CLI config
│   └── migrations          # SQL migrations
├── package.json            # Root workspace scripts
├── turbo.json              # Turbo pipeline
└── tsconfig.json           # Workspace path aliases
```

## How The Apps Fit Together

- `apps/web` and `apps/mobile` are thin shells.
- Shared feature screens live in `packages/app/features`.
- Shared providers live in `packages/app/provider`.
- Shared primitives and design-system components live in `packages/ui`.
- Web and mobile both use the same auth store from `packages/api/store/auth.store.ts`.
- tRPC procedures live in `packages/api/routers`.
- Supabase schema is managed locally through the `supabase/` folder.

## Requirements

- Node.js `22`
- npm `10.8+`
- Yarn `4.5.0`
- Supabase CLI
- For mobile iOS: Xcode
- For mobile Android: Android Studio / SDK

## Install

Enable Corepack and install dependencies from the repo root:

```bash
corepack enable
corepack prepare yarn@4.5.0 --activate
yarn install
```

## Environment Setup

This repo currently uses app-local env files:

- `apps/web/.env`
- `apps/mobile/.env`

### Web

Set these values in `apps/web/.env`:

```bash
IGNORE_TS_CONFIG_PATHS=true
TAMAGUI_TARGET=web
TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD=1
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
NEXT_PUBLIC_TRPC_API=http://localhost:3000
```

### Mobile

Set this in `apps/mobile/.env`:

```bash
EXPO_PUBLIC_TRPC_API=http://YOUR_LOCAL_IP:3000
```

Use your machine's LAN IP, not `localhost`, when running the Expo app on a physical device.

## Running The Project

### 1. Start Supabase

```bash
yarn db:start
```

Useful database commands:

```bash
yarn db:stop
yarn db:reset
yarn db:generate
```

### 2. Start The Web App

```bash
yarn web
```

This runs the shared package builds first, then starts Next.js in `apps/web`.

Other web commands:

```bash
yarn web:extract
yarn web:prod
yarn web:prod:serve
```

### 3. Start The Mobile App

In a separate terminal:

```bash
yarn mobile
```

Platform-specific commands:

```bash
yarn ios
yarn android
yarn mobile:prebuild
```

## Development Commands

```bash
yarn build
yarn test
yarn test:watch
yarn watch
```

## Package Notes

### `apps/web`

- Next.js App Router frontend
- Uses `NextTamaguiProvider` and `TRPCProvider`
- Route files mostly delegate to shared screens in `packages/app`

### `apps/mobile`

- Expo app using Expo Router
- Loads fonts and wraps the app with shared providers
- Uses the same feature screens as the web app

### `packages/app`

- Main cross-platform application layer
- Contains auth, home, and user feature screens
- Contains shared provider composition

### `packages/ui`

- Shared UI components and Tamagui exports
- Intended to be reused by both web and mobile

### `packages/api`

- tRPC client/server types
- Auth procedures
- Persisted Zustand auth store
- Platform-specific storage adapters for web and native

### `packages/db`

- Supabase client creation
- Generated database types

### `supabase`

- Local Supabase project config
- SQL migrations for schema changes

## Current Route Map

### Web

- `/`
- `/signin`
- `/user/[id]`

### Mobile

- `/`
- `/signin`
- `/user/[id]`

## Testing

Web tests currently live in:

- `apps/web/__tests__` for Vitest
- `apps/web/e2e` for Playwright

Run all root Vitest tests with:

```bash
yarn test
```

Run web-only tests from the web app directory if needed:

```bash
cd apps/web
yarn test
```

## Notes

- The repo uses workspace path aliases such as `@revit/app/*`, `@revit/ui/*`, `@revit/api/*`, and `@revit/db/*`.
- The web app depends on local Supabase and a reachable tRPC endpoint.
- The mobile app needs `EXPO_PUBLIC_TRPC_API` to point to a host the device or simulator can reach.
