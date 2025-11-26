# Backend Tests — Testing Plan

## Overview

This document describes the testing plan for the backend tests located in `Backend/tests`.
The test suite uses `jest`, `supertest`, and `mongodb-memory-server` to run unit and integration tests in an isolated environment.

## Test directory

- **Location:** `Backend/tests`
- **Entry files present:** `administrator.test.js`, `career.test.js`, `faculty.test.js`, `student.test.js`, `user.test.js`, and `setup.js`.

## Goals

- Verify service and controller behavior for core resources (users, students, administrators, careers, faculties).
- Ensure API routes return expected status codes and payloads.
- Keep tests fast and isolated by using an in-memory MongoDB instance.

## Test file mapping

- `administrator.test.js`: Tests administrator-related flows (creation, retrieval, permissions).
- `career.test.js`: Tests career entity CRUD and validation rules.
- `faculty.test.js`: Tests faculty entity CRUD and relations.
- `student.test.js`: Tests student registration, updates, and related endpoints.
- `user.test.js`: Tests authentication, user creation, and user-specific flows.
- `setup.js`: Jest setup file — configures `mongodb-memory-server`, global test setup/teardown, and any test fixtures.

> Note: The above mapping is based on file names. For precise coverage, open each test file and expand or update these descriptions.

## How to run tests (local)

- From the `Backend` directory run:

```bash
cd Backend
npm install
npm test
```

- The `test` script runs `jest --runInBand` (see `Backend/package.json`). Running `--runInBand` may be required for stable `mongodb-memory-server` behavior on some systems.

## Jest configuration (from `Backend/package.json`)

- `testEnvironment`: `node`
- `testTimeout`: `30000` (30s)
- `setupFilesAfterEnv`: `tests/setup.js`
- `testMatch`: `**/tests/**/*.test.js`

## Environment & setup notes

- Tests use `mongodb-memory-server` so a running external MongoDB instance is not required for CI or local testing.
- If any tests depend on environment variables, document them in `tests/setup.js` or create an `.env.test` and load it from the setup file.
- Ensure `jest` and `supertest` are installed (they are listed under `devDependencies`).

## CI

- Add a GitHub Actions workflow that:
  - Checks out the repo
  - Installs Node (match project's Node version)
  - Runs `npm ci` in `Backend`
  - Runs `npm test`
- Cache `node_modules` or rely on `npm ci` for reproducibility.
