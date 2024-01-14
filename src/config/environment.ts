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
  }
}
