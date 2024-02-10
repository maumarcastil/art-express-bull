import dotenv from 'dotenv'
dotenv.config()

export const config = {
  node_env: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT ?? 3000,
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: process.env.REDIS_PORT ?? 6379,
    db: process.env.REDIS_DB ?? 0,
    password: process.env.REDIS_PASSWORD ?? ''
  },
  torProxy: {
    host: process.env.TOR_PROXY_HOST ?? 'localhost',
    port: process.env.TOR_PROXY_PORT ?? 9050
  },
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://admin:password@localhost:27017/',
  mongoDbName: process.env.MONGO_DB_NAME ?? 'art'
}
