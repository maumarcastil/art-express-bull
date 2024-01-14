import Queue from 'bull'

import { config } from './config/environment'
import { artistWorker } from './workers/artists.worker'

export const artistQueue = new Queue('artist', {
  redis: {
    host: config.redis.host,
    port: Number(config.redis.port),
    db: Number(config.redis.db),
    password: config.redis.password
  }
})

void artistQueue.process(async (job, done) => { await artistWorker(job, done) })

/* void artistQueue.add({ name: 'John Doeda sddas' }) */

export const queues = [
  {
    name: 'artist',
    hostId: 'Artist Queue Manager',
    redis: {
      host: config.redis.host,
      port: Number(config.redis.port),
      db: Number(config.redis.db),
      password: config.redis.password
    }
  }
]

export const initializeQueues = (): void => {
  void artistQueue.isReady().then(() => {
    console.log('Artist queue ready ✅')
  })
}
