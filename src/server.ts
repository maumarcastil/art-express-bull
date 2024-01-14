import Bull from 'bull'
import Arena from 'bull-arena'
import { type Express } from 'express'

import { queues } from './queues'

export const initExpressServer = (app: Express, port: number): void => {
  const arenaConfig = Arena({
    Bull,
    queues
  }, {
    basePath: '/arena',
    disableListen: true
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.use('/', arenaConfig)
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}
