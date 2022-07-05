## Structure

```
.
|-- prisma
|   `-- schema.prisma
|-- requests
|   |-- createUser.http
|   |-- deleteUser.http
|   |-- findOneUser.http
|   `-- listUsers.http
|-- src
|   |-- api
|   |-- common
|   |   |-- envs
|   |   `-- helper
|   |       `-- env.helper.ts
|   |   `-- users
|   |       |-- dto
|   |       |   |-- create-user.dto.ts
|   |       |   `-- update-user.dto.ts
|   |       |-- entities
|   |       |   |-- role.enum.ts
|   |       |   `-- user.entity.ts
|   |       |-- roles.decorator.ts
|   |       |-- roles.guard.ts
|   |       |-- users.controller.ts
|   |       |-- users.module.ts
|   |       `-- users.service.ts
|   `-- main.ts
|   |-- app.module.ts
|-- test
|   |-- app.e2e-spec.ts
|   `-- jest-e2e.json
|-- README.md
|-- nest-cli.json
|-- package-lock.json
|-- package.json
|-- tsconfig.build.json
`-- tsconfig.json
```