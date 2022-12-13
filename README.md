
# Installtion

```sh
$ nvm use # use node version v16.17.0
$ yarn # install dependencies
$ docker-compose up -d db # start postgresql container
$ yarn prisma:migrate # create database and seed
```

# Running the app
```
$ yarn dev // in development mode
$ yarn prod // build the app and run in production mode
```

# Test
```
$ yarn test
```

## Prisma init
```
$ npx prisma init --datasource-provider postgresql
$ npx prisma migrate dev --name init
$ npx prisma db pull (not sure) 
$ npx prisma generate

```
