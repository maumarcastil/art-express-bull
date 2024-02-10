import axios from '../config/axios'

import ArtistModel from '../models/artistModel'

import { type ArtistNormalize, type ArtistBasicNormalize } from '../interface/artists'

export class ArtistsService {
  private readonly artistModel = ArtistModel
  private readonly baseUrlGoogle = 'https://artsandculture.google.com'
  private readonly urlGetArtistsForLetter = 'https://artsandculture.google.com/api/objects/category'
  private readonly urlGetArtistByUid = 'https://artsandculture.google.com/api/entity'

  public async getArtistsByLetter (letter: string, skip = ''): Promise<any[]> {
    const letterUpper = letter.toUpperCase()

    const params = {
      categoryId: 'artist',
      s: '200', // limit
      tab: 'az',
      pr: letterUpper,
      pt: skip, // skip
      rt: 'j' // param to get json response
    }
    const queryParams = new URLSearchParams(params).toString()
    const url = `${this.urlGetArtistsForLetter}?${queryParams}`

    try {
      const randomTime = Math.floor(Math.random() * (2000 - 300 + 1)) + 300
      await this.delay(randomTime)
      const response = await axios.get(url)
      const data = response.data.replace(')]}\'\n', '') as string
      const parsedData = JSON.parse(data)

      const info = parsedData[0][0]
      const artists = info[2]
      const mySkip: string | undefined = info[8]

      if (mySkip !== undefined && mySkip.length > 0) {
        // Si existe mySkip, llamar a la función de nuevo con el nuevo skip
        const newArtists = await this.getArtistsByLetter(letter, mySkip)
        return [...artists, ...newArtists]
      }

      return artists
    } catch (error: any) {
      console.log('🚀 ~ ArtistsService ~ getArtistsForLetter ~ error:', error)
      throw error
    }
  }

  public async getArtistByUid (uid: string): Promise<ArtistNormalize> {
    const params = {
      entityId: uid.replace(/\//g, ''),
      rt: 'j'
    }

    const queryParams = new URLSearchParams(params).toString()
    const url = `${this.urlGetArtistByUid}?${queryParams}`
    try {
      const randomTime = Math.floor(Math.random() * (2000 - 300 + 1)) + 300
      await this.delay(randomTime)
      const response = await axios(url, { method: 'GET' })
      const data = response.data.replace(')]}\'\n', '') as string
      const parsedData = JSON.parse(data)

      const info = parsedData[0][0]

      const normalizeArtist = this.normalizeArtist(info)
      return normalizeArtist
    } catch (error) {
      console.log('🚀 ~ getArtistByUid ~ error:', error)
      throw error
    }
  }

  public async saveArtist (artist: ArtistNormalize): Promise<void> {
    try {
      const existingArtist = await this.artistModel.findOne({
        uid: artist.uid
      })

      if (existingArtist === null) {
        await this.artistModel.create(artist)
        console.log('🚀 ~ saveArtist ~ artist:', artist.name)
      } else {
        if (!this.areArtistsEqual(existingArtist, artist)) {
          await this.artistModel.updateOne({
            uid: artist.uid
          }, artist)
          console.log('🚀 ~ updateArtist ~ artist:', artist.name)
        } else {
          console.log('🚀 ~ saveArtist ~ artist already exists:', artist.name)
        }
      }
    } catch (error) {
      console.log('🚀 ~ saveArtist ~ error:', error)
      throw error
    }
  }

  public normalizeArtists (artists: any[]): ArtistBasicNormalize[] {
    const artistsNormalized: ArtistBasicNormalize[] = artists.map((artist: any) => {
      return {
        uid: artist[21][1] ?? artist[24][0],
        name: artist[1],
        itemCount: artist[2],
        imageUrl: artist[3],
        entityUrl: `${this.baseUrlGoogle}${artist[4]}`
      }
    })
    return artistsNormalized
  }

  private normalizeArtist (artist: any): ArtistNormalize {
    return {
      uid: artist[2],
      name: artist[4],
      itemCount: artist[9][4],
      imageUrl: artist[5],
      datesOfLife: artist[6] ?? null,
      entityUrl: artist[18][2],
      bio: artist[7][1],
      moreInfo: {
        source: artist[8][0],
        url: artist[8][1]
      }
    }
  }

  private areArtistsEqual (artist1: ArtistNormalize, artist2: ArtistNormalize): boolean {
    return (artist1.uid === artist2.uid &&
      artist1.name === artist2.name &&
      artist1.itemCount === artist2.itemCount &&
      artist1.imageUrl === artist2.imageUrl &&
      artist1?.datesOfLife === artist2?.datesOfLife &&
      artist1.entityUrl === artist2.entityUrl &&
      artist1?.bio === artist2?.bio &&
      artist1?.moreInfo?.source === artist2?.moreInfo?.source &&
      artist1?.moreInfo?.url === artist2?.moreInfo?.url)
  }

  public async delay (ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms))
  }
}
