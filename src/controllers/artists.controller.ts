import { type Request, type Response } from 'express'

import { type ArtistsService } from '../service/artists.service'

import { artistQueue } from '../queues'

export class ArtistsController {
  private readonly artistQueue = artistQueue

  constructor (private readonly artistsService: ArtistsService) {}

  public async getArtistsForLetter (req: Request, res: Response): Promise<void> {
    const { letter } = req.query
    const artists = await this.artistsService.getArtistsByLetter(letter as string)
    const artistsNormalized = this.artistsService.normalizeArtists(artists)
    for await (const iterator of artistsNormalized) {
      await this.artistQueue.add(iterator)
    }
    res.json(artistsNormalized)
  }
}
