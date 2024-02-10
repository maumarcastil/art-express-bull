import morgan from 'morgan'
import express, { type Request, type Response, type Express } from 'express'

import { config } from './config/environment'

import { initializeQueues } from './queues'
import { initExpressServer } from './server'
/* import { artistQueue } from './queues' */

const app: Express = express()
app.use(morgan('dev'))
app.use(express.json())

app.get('/health', (request: Request, response: Response) => {
  response
    .status(200)
    .json({
      message: 'Works as expected',
      info: {
        url: `${request.protocol}://${request.hostname}${request.path}`
      }
    })
    .end()
})

initializeQueues()
initExpressServer(app, Number(config.port))
