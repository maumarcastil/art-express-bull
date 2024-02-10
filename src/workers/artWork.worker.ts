import type Queue from 'bull'

import { ArtWorkService } from '../service/artWork.service'

import { type ArtWorkBasicNormalize } from '../interface/artWork'

const artWorkService = new ArtWorkService()

export const artWorkWorker = async (job: Queue.Job<ArtWorkBasicNormalize>, done: Queue.DoneCallback): Promise<void> => {
  try {
    const artWork = await artWorkService.getArtWorkByUid(job.data)

    await artWorkService.saveArtWork({
      ...artWork,
      creatorUid: job.data.artistUid,
      entityUrl: job.data.entityUrl
    })
    done(null, {
      ...artWork,
      creatorUid: job.data.artistUid,
      entityUrl: job.data.entityUrl
    })
  } catch (error) {
    console.log('🚀 ~ artWorkWorker ~ error:', error)
    done(error as Error)
  }
}
