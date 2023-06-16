module.exports = {
  url: process.env.DATABASE_URL,
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5435,
  password: process.env.DATABASE_PASSWORD,
  database: `${process.env.DATABASE_NAME}`,
  username: process.env.DATABASE_USERNAME,
  synchronize: true,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/**/*.ts'],
  cli: {
    entitiesDir: 'src/database/entities',
    migrationsDir: 'src/database/migrations',
  },
};
