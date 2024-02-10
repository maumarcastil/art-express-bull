import Queue, { type Job } from 'bull'

import { config } from './config/environment'

import { artistWorker } from './workers/artists.worker'
import { artWorkWorker } from './workers/artWork.worker'

import { type ArtistBasicNormalize } from './interface/artists'
import { type ArtWorkBasicNormalize } from './interface/artWork'

export const artistQueue = new Queue('artist', {
  redis: {
    host: config.redis.host,
    port: Number(config.redis.port),
    db: Number(config.redis.db),
    password: config.redis.password
  }
})

export const artWorkQueue = new Queue('artWork', {
  redis: {
    host: config.redis.host,
    port: Number(config.redis.port),
    db: Number(config.redis.db),
    password: config.redis.password
  }
})

void artistQueue.process(async (job: Job<ArtistBasicNormalize>, done) => { await artistWorker(job, done) })
void artWorkQueue.process(async (job: Job<ArtWorkBasicNormalize>, done) => { await artWorkWorker(job, done) })

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
  },
  {
    name: 'artWork',
    hostId: 'ArtWork Queue Manager',
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
  void artWorkQueue.isReady().then(() => {
    console.log('ArtWork queue ready ✅')
  })
}
