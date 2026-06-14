# Project Learning Guide

## Big Picture

This workspace has two apps:

- `backend/` is a Quarkus API written in Java.
- `frontend/` is a Vite + React app written in TypeScript.

The backend is the part that talks to the database.
The frontend is the browser UI that should call the backend over HTTP.


## What The Backend Is Doing

The backend user flow is split into layers on purpose:

- `UserResource` handles HTTP requests and responses.
- `UserService` contains the business logic and transaction boundaries.
- `UserRepository` handles database access.
- `User` is the database entity.
- `UserDto` is the shape exposed by the API.
- `UserMapper` converts between the API shape and the database entity.

That split matters because each layer has one job.
It makes the code easier to test, easier to change, and safer to expose to the frontend.

## Where The Database Is

The local development database is defined in [backend/docker-compose.yml](backend/docker-compose.yml).
It starts a Postgres container on `localhost:5432` with these defaults:

- database name: `quarkus`
- username: `quarkus`
- password: `quarkus`

That is the database you connect to when you run the backend locally with Docker.

The backend configuration in [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties) says the datasource is PostgreSQL and enables Quarkus Dev Services.
That means Quarkus can also spin up a temporary database automatically when needed, especially in tests or when no external database is running.

## Where Credentials Live

The current local database credentials are not hidden in code because this is a local development setup.
They are declared in `docker-compose.yml` for the Postgres container.

For a different database, the backend expects environment variables such as:

- `QUARKUS_DATASOURCE_JDBC_URL`
- `QUARKUS_DATASOURCE_USERNAME`
- `QUARKUS_DATASOURCE_PASSWORD`

That is the right place for real credentials in a deployed environment.
Do not hardcode production credentials into the source files.

## How The Schema Gets Created

The table structure is managed by Flyway migration scripts in [backend/src/main/resources/db/migration](backend/src/main/resources/db/migration).

The current migration is [V1__create_users_table.sql](backend/src/main/resources/db/migration/V1__create_users_table.sql).
It creates the `users` table with `id`, `name`, and `email`.

This is why the repository does not need you to manually create tables during startup.
The migration is the source of truth for the schema.

## Why We Use DTOs

The API should not expose the database entity directly.

`UserDto` is the API contract.
`User` is the persistence model.

Keeping them separate gives you control over what the frontend sees and lets the database shape change without breaking the API.
That is also why `UserMapper` exists.

## How A Request Flows

When a client sends a request like `POST /users`:

1. `UserResource` receives the HTTP request.
2. Quarkus validates the payload using the DTO annotations.
3. `UserService` converts the DTO into an entity.
4. `UserRepository` saves the entity to Postgres.
5. `UserMapper` converts the saved entity back to a DTO.
6. The resource returns JSON to the client.

That is the main chain to keep in your head.

## How The Frontend Connects

The frontend entry point is [frontend/src/main.tsx](frontend/src/main.tsx), which mounts the React app.
The root orchestrator is [frontend/src/App.tsx](frontend/src/App.tsx), which manages routing and authentication state.

The frontend uses a three-page architecture:

- [frontend/src/pages/login.tsx](frontend/src/pages/login.tsx) — Email/password login that calls `UserService.findByEmail()` on the backend.
- [frontend/src/pages/signup.tsx](frontend/src/pages/signup.tsx) — User registration that creates a new user via the backend API.
- [frontend/src/pages/dashboard.tsx](frontend/src/pages/dashboard.tsx) — User management interface showing a list of all users with edit and delete functionality.

The API client is [frontend/src/services/api.js](frontend/src/services/api.js), which handles HTTP communication with the backend.

The browser app calls the backend on `http://localhost:8080` (proxied via Vite).
Authentication state is stored in browser `localStorage` to persist sessions across page reloads.

## Authentication Flow

1. User enters email/password on the login page.
2. Frontend calls `POST /api/users/login` with email and password.
3. Backend `UserService.findByEmail()` queries the database for that email.
4. If found and password matches, the user object is returned and stored in `localStorage`.
5. Frontend checks `localStorage` on app load to determine if user is logged in.
6. If logged in, user is routed to the dashboard; otherwise to the login page.

No hardcoded users — all authentication is database-backed via email lookup.

## Styling

The frontend uses **Tailwind CSS** for all styling.
Tailwind is configured as a Vite plugin in [frontend/vite.config.ts](frontend/vite.config.ts) and styles are imported in [frontend/src/index.css](frontend/src/index.css).
All UI components use Tailwind utility classes for responsive, consistent styling.

## Project Structure

After cleanup:
- `frontend/src/pages/` contains the three page components (login, signup, dashboard)
- `frontend/src/services/` has the API client
- `frontend/src/assets/` and `frontend/src/types/` contain reusable utilities
- Empty scaffolding directories have been removed

## Why The Project Is Split This Way

This separation is mostly about reducing confusion later:

- REST layer: handles HTTP details only.
- Service layer: handles business rules and transactions.
- Repository layer: handles database queries and persistence.
- Entity layer: matches the database.
- DTO layer: matches the API.

If you keep those boundaries clear, you can change one part without breaking everything else.

## What To Read In Order

If you want to learn the backend first, read these files in this order:

1. [backend/src/main/java/org/user/UserResource.java](backend/src/main/java/org/user/UserResource.java)
2. [backend/src/main/java/org/user/UserService.java](backend/src/main/java/org/user/UserService.java)
3. [backend/src/main/java/org/user/UserRepository.java](backend/src/main/java/org/user/UserRepository.java)
4. [backend/src/main/java/org/user/UserMapper.java](backend/src/main/java/org/user/UserMapper.java)
5. [backend/src/main/java/org/user/UserDto.java](backend/src/main/java/org/user/UserDto.java)
6. [backend/src/main/java/org/user/User.java](backend/src/main/java/org/user/User.java)
7. [backend/src/main/resources/db/migration/V1__create_users_table.sql](backend/src/main/resources/db/migration/V1__create_users_table.sql)

If you want the frontend view, read these next:

1. [frontend/src/main.tsx](frontend/src/main.tsx)
2. [frontend/src/App.tsx](frontend/src/App.tsx)
3. [frontend/src/services/api.js](frontend/src/services/api.js)

## Current Reality Check

This repo is not fully wired end to end yet.

The backend user module has the structure you would expect, but the frontend still needs to be connected to it.
That is why things can feel scattered when you open the project from the UI side first.

If you want, the next useful step is to turn this guide into a real onboarding map with a simple diagram and a glossary of the main classes.