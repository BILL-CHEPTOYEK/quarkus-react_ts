# Backend guide

This backend uses Quarkus with a layered user module:

- REST resource for HTTP endpoints
- application service for business rules and transactions
- Panache repository for persistence
- JPA entity for storage
- DTO plus mapper for the API boundary

The user module is intentionally small, but it follows the same shape you would use in a larger enterprise service.

## Local database

The application expects PostgreSQL in dev mode.

Start it from the backend directory:

```shell script
docker compose up -d postgres
```

Default credentials are `quarkus / quarkus`, and the database name is `quarkus`.

To run the backend against that same database, load the local env file first:

```shell script
set -a
source .env.compose
set +a
./mvnw quarkus:dev
```

If you need to point the app at another database, set:

- `QUARKUS_DATASOURCE_JDBC_URL`
- `QUARKUS_DATASOURCE_USERNAME`
- `QUARKUS_DATASOURCE_PASSWORD`

## Schema management

The schema is created with Flyway migration scripts under `src/main/resources/db/migration`.

Do not hand-edit the tables in Hibernate generation mode for this module. Add a new migration file instead.

## Running the application

```shell script
./mvnw quarkus:dev
```

## Running tests

```shell script
./mvnw test
```

The test profile uses H2 in PostgreSQL compatibility mode so the user module can be verified without a running PostgreSQL instance.

## User endpoints

- `GET /users`
- `GET /users/{id}`
- `POST /users`
- `PUT /users/{id}`
- `DELETE /users/{id}`

## Code standards used here

- Keep REST, service, repository, and persistence concerns separated.
- Expose DTOs from the API, not entities.
- Validate request payloads at the boundary.
- Keep schema changes in migrations.
- Cover the happy path and the validation path with tests.

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:

```shell script
./mvnw quarkus:dev
```

> **_NOTE:_**  Quarkus now ships with a Dev UI, which is available in dev mode only at <http://localhost:8080/q/dev/>.

## Packaging and running the application

The application can be packaged using:

```shell script
./mvnw package
```

It produces the `quarkus-run.jar` file in the `target/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/quarkus-app/lib/` directory.

The application is now runnable using `java -jar target/quarkus-app/quarkus-run.jar`.

If you want to build an _über-jar_, execute the following command:

```shell script
./mvnw package -Dquarkus.package.jar.type=uber-jar
```

The application, packaged as an _über-jar_, is now runnable using `java -jar target/*-runner.jar`.

## Creating a native executable

You can create a native executable using:

```shell script
./mvnw package -Dnative
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using:

```shell script
./mvnw package -Dnative -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./target/code-with-quarkus-1.0.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult <https://quarkus.io/guides/maven-tooling>.

## Provided Code

### REST

Easily start your REST Web Services

[Related guide section...](https://quarkus.io/guides/getting-started-reactive#reactive-jax-rs-resources)
