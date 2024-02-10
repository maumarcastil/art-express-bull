import { type Request, type Response } from 'express'

import { type ArtWorkService } from '../service/artWork.service'

import { artWorkQueue } from '../queues'

export class ArtWorkController {
  private readonly artWorkQueue = artWorkQueue

  constructor (private readonly artWorkService: ArtWorkService) {}

  public async getArtWorksByArtist (req: Request, res: Response): Promise<void> {
    const { artistUid } = req.query
    const artWorks = await this.artWorkService.getArtWorksByArtist(artistUid as string)
    const artWorksNormalized = this.artWorkService.normalizeArtWorks(artWorks, artistUid as string)
    for await (const iterator of artWorksNormalized) {
      await this.artWorkQueue.add(iterator)
    }
    res.json(artWorksNormalized)
  }
}
