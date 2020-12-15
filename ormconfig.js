module.exports = [
  {
    type: "postgres",
    host: process.env.ORM_HOST,
    port: process.env.ORM_PORT,
    username: process.env.ORM_USER,
    database: process.env.ORM_DATABASE,
    password: process.env.ORM_PASSWORD,
    migrations: [
      process.env.RUN_MODE  === 'development'
      ? "./src/shared/infra/typeorm/migrations/*.ts"
      : "./dist/shared/infra/typeorm/migrations/*.js"
    ],
    entities: [
      process.env.RUN_MODE  === 'development'
      ? "./src/modules/**/infra/typeorm/entities/*.ts"
      : "./dist/modules/**/infra/typeorm/entities/*.js"
    ],
    cli: {
      migrationsDir:
        process.env.RUN_MODE  === 'development'
        ? "./src/shared/infra/typeorm/migrations"
        : "./dist/shared/infra/typeorm/migrations"
    }
  }
]
