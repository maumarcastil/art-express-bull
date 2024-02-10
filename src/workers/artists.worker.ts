import type Queue from 'bull'

import { ArtistsService } from '../service/artists.service'

import { type ArtistBasicNormalize } from '../interface/artists'
import axios from '../config/axios'

const artistsService = new ArtistsService()

export const artistWorker = async (job: Queue.Job<ArtistBasicNormalize>, done: Queue.DoneCallback): Promise<void> => {
  try {
    const { uid } = job.data
    const artist = await artistsService.getArtistByUid(uid)
    await artistsService.saveArtist(artist)

    // add the artist's artwork to the queue
    await axios.get(`http://localhost:3000/artwork/get-by-artist?artistUid=${uid}`)
    done(null, artist)
  } catch (error: any) {
    done(error as Error)
  }
}
