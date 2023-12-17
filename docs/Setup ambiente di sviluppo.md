## Setup

Node 18 and pnpm 8.11 are required.

Install dependencies:
```sh
pnpm i
```

Create `.env` from `.env.example`, the only value that need to be set is `PUBLIC_MAPBOX_TOKEN`

Ensure you have docker daemon running

Spin up the database:
```shell
cd cd .devcontainer && docker compose up
```
> Note: Feel free to stop all and run only the db container, the app devcontainer it's not tested yet

Push Prisma schema to database and seed with new data:
```sh
pnpm db:reset
```

To start a development server:
```sh
pnpm run dev
```

## Optional: Generate a secret for local authentication

```sh
openssl rand -hex 32
```
And set it as the `AUTH_SECRET` variable
