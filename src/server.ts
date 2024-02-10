import Bull from 'bull'
import Arena from 'bull-arena'
import mongoose from 'mongoose'
import { type Express } from 'express'

import { queues } from './queues'

import { config } from './config/environment'

import { loadArtistsRoutes } from './routes/artists.routes'
import { loadArtWorkRoutes } from './routes/artWork.routes'

export const initExpressServer = (app: Express, port: number): void => {
  const arenaConfig = Arena({
    Bull,
    queues
  }, {
    basePath: '/arena',
    disableListen: true
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  loadArtistsRoutes(app)
  loadArtWorkRoutes(app)

  app.use('/', arenaConfig)

  void mongoose.connect(config.mongoUrl, { dbName: config.mongoDbName })
    .then((res) => {
      console.log('🚀 db successfully connected ✅')
    })
    .catch(() => {
      console.log('🚀 db connection failed ❌')
    })

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}
