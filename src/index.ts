import express, { type Express } from 'express'

import { PORT } from './config/environment'
import { initExpressServer } from './server'

const app: Express = express()

initExpressServer(app, Number(PORT) ?? 3000)
