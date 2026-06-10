# Contributing to Whispr

First off, thanks for taking the time to contribute!

All types of contributions are encouraged and valued. Please read the relevant section below before making your contribution — it makes things smoother for everyone.

> Don't have time to contribute code? You can still help:
> - Star the project
> - Share it with friends or on social media
> - Reference Whispr in your own project's README

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Conventions](#conventions)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

This project and everyone participating in it is governed by the [Whispr Code of Conduct](/CODE_OF_CONDUCT.md). By participating, you are expected to uphold it. Please report unacceptable behavior to <hendurhance.dev@gmail.com>.

## I Have a Question

Before asking, please read the [README](/README.md) and search existing [issues](https://github.com/hendurhance/whispr/issues) — your question may already be answered. If not:

- Open a new [issue](https://github.com/hendurhance/whispr/issues/new).
- Provide as much context as you can (what you're trying to do, what happened).
- Include relevant versions (Node.js, npm, OS).

## Development Setup

Whispr is a **Next.js 16 + React 19 + TypeScript** app on **Supabase** (Postgres + Auth + Edge Functions), styled with **Tailwind CSS v4**. Full setup lives in the [README](/README.md#getting-started); the short version:

```sh
git clone https://github.com/hendurhance/whispr.git
cd whispr
npm install
cp .env.local.example .env.local # then fill in your Supabase keys (see README)
# run migrations/001..007 in your Supabase SQL editor
npm run dev
```

Before opening a PR, make sure the project is green:

```sh
npx tsc --noEmit # type-check (zero errors)
npm run lint # eslint
npm run build # production build must succeed
```

If you touch reserved usernames, also run `npm run check:reserved` (it fails if `utils/validation.ts` and the `006` migration drift apart). A pre-commit hook (husky + lint-staged) runs `eslint --fix` automatically.

## Project Structure

```
app/ # routes — (public) / (authenticated) / (marketing) groups, og/ image routes
components/ # ui (shadcn), dashboard, public-profile, landing, marketing, brand, pwa
lib/ # next/og share cards, client/server data, prompts & marketing & blog content
hooks/ # client-interaction hooks (no data fetching)
utils/ # supabase clients + Zod validation
migrations/ # 001–007 SQL (RLS, RPCs, triggers)
supabase-fns/ # Deno Edge Functions
```

## Conventions

- **TypeScript everywhere** — no plain `.js` in app code, no `any`, no `@ts-ignore`.
- **Validate at trust boundaries** with Zod (`utils/validation.ts` is the source of truth — keep it in sync with the DB).
- **Server-first** — prefer React Server Components; use `'use client'` only for interactive leaves.
- **Match the surrounding style** — follow the existing patterns and conventions in the codebase.
- Keep changes **surgical** — touch only what your change requires.

## Submitting Changes

1. Fork the repo and create a branch from `main` (e.g. `fix/inbox-filter` or `feat/dark-mode`).
2. Make your change, keeping commits focused.
3. Ensure `tsc`, `lint` and `build` all pass.
4. Open a pull request with a clear title and description — what changed, why, and how to test it. Link any related issue.
5. A maintainer will review; address feedback, and once approved it'll be merged.

## Reporting Bugs

> **Never** report security issues, vulnerabilities or anything with sensitive information in a public issue. Email them to <hendurhance.dev@gmail.com>.

A good bug report saves everyone time. Before filing:

- Make sure you're on the latest `main` and that it isn't a local/environment issue.
- Search the [bug tracker](https://github.com/hendurhance/whispr/issues?q=label%3Abug) for an existing report.

When you file a [new issue](https://github.com/hendurhance/whispr/issues/new), include:

- What you **expected** vs what **actually** happened.
- Clear **reproduction steps** (and a minimal repro if you can).
- Any stack trace / console errors, and your OS + Node/npm versions.

Once filed, the team will label it, try to reproduce, and either ask for more detail (`needs-repro`) or mark it ready to fix (`needs-fix`).

## Suggesting Enhancements

Enhancement ideas — new features or improvements — are tracked as [GitHub issues](https://github.com/hendurhance/whispr/issues).

Before suggesting:

- Make sure you're on the latest version and the feature doesn't already exist.
- [Search](https://github.com/hendurhance/whispr/issues) for an existing suggestion and add to it rather than duplicating.
- Consider whether it fits the project's scope (useful to most users, not a tiny subset).

A good suggestion includes:

- A **clear, descriptive title**.
- A **step-by-step description** of the proposed behavior.
- The **current behavior** and **why** the change is an improvement.
- Optional **screenshots / mockups** to illustrate.

Thanks again — the community looks forward to your contributions!
