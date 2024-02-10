import axiosInstance from '../config/axios'

import ArtWorkModel from '../models/artWorkModel'

import { convertToCamelCase } from '../utils/camelCase'

import { type ArtWorkNormalize, type ArtWorkBasicNormalize } from '../interface/artWork'

export class ArtWorkService {
  private readonly artWorkModel = ArtWorkModel
  private readonly baseUrlGoogle = 'https://artsandculture.google.com'
  private readonly urlGetArtWorksByArtist = 'https://artsandculture.google.com/api/entity/assets'
  private readonly urlGetArtWorkByUid = 'https://artsandculture.google.com/api/asset'

  public async getArtWorksByArtist (artistUid: string, skip = ''): Promise<any[]> {
    const params = {
      entityId: artistUid,
      categoryId: 'artist',
      s: '200', // limit
      pt: skip, // skip
      rt: 'j' // param to get json response
    }

    const queryParams = new URLSearchParams(params).toString()
    const url = `${this.urlGetArtWorksByArtist}?${queryParams}`

    try {
      const randomTime = Math.floor(Math.random() * (3000 - 1500 + 1)) + 1500
      await this.delay(randomTime)
      const response = await axiosInstance.get(url)
      const data = response.data.replace(')]}\'\n', '') as string
      const parsedData = JSON.parse(data)

      const info = parsedData[0][0]
      const artWork = info[2]
      const mySkip: string | undefined = info[8]

      if (mySkip !== undefined && mySkip.length > 0) {
        // Si existe mySkip, llamar a la función de nuevo con el nuevo skip
        const newArtWork = await this.getArtWorksByArtist(artistUid, mySkip)
        return [...artWork, ...newArtWork]
      }

      return artWork
    } catch (error: any) {
      console.log('🚀 ~ artWorkService ~ getArtWorksByArtist ~ error:', error)
      throw error
    }
  }

  public async getArtWorkByUid (artWork: ArtWorkBasicNormalize): Promise<ArtWorkNormalize> {
    const params = {
      assetId: artWork.uid,
      rt: 'j' // param to get json response
    }

    const queryParams = new URLSearchParams(params).toString()
    const url = `${this.urlGetArtWorkByUid}?${queryParams}`

    try {
      const randomTime = Math.floor(Math.random() * (2000 - 300 + 1)) + 300
      await this.delay(randomTime)
      const response = await axiosInstance.get(url)
      const data = response.data.replace(')]}\'\n', '') as string
      const parsedData = JSON.parse(data)

      const info = parsedData[0][0]

      const normalizeArtist = this.normalizeArtWork(info)
      return normalizeArtist
    } catch (error: any) {
      console.log('🚀 ~ artWorkService ~ getArtWorkByUid ~ error:', error)
      throw error
    }
  }

  public async saveArtWork (artWork: ArtWorkNormalize): Promise<void> {
    try {
      const existingArtWork = await this.artWorkModel.findOne({
        uid: artWork.uid
      })

      if (existingArtWork === null) {
        await this.artWorkModel.create(artWork)
        console.log('🚀 ~ saveArtWork ~ artwork:', artWork.title)
      } else {
        if (!this.areArtWorksEqual(existingArtWork, artWork)) {
          await this.artWorkModel.findOneAndUpdate({
            uid: artWork.uid
          }, artWork)
          console.log('🚀 ~ saveArtWork ~ artwork:', artWork.title)
        } else {
          console.log('🚀 ~ saveArtWork ~ artwork already exists:', artWork.title)
        }
      }
    } catch (error) {
      console.log('🚀 ~ saveArtWork ~ error:', error)
      throw error
    }
  }

  public normalizeArtWorks (artWork: any[], artistUid: string): ArtWorkBasicNormalize[] {
    const artworksNormalized: ArtWorkBasicNormalize[] = artWork.map((artWork) => {
      return {
        artistUid,
        uid: artWork[21][1] ?? artWork[10][0],
        title: artWork[1],
        artistName: artWork[2],
        imageUrl: artWork[3],
        entityUrl: `${this.baseUrlGoogle}${artWork[4]}`
      }
    })
    return artworksNormalized
  }

  public normalizeArtWork (artWork: any): ArtWorkNormalize {
    const info = artWork[2]

    const otherInfo: any = {}
    if (info[12] !== undefined) {
      info[12]?.forEach((i: any[]) => {
        otherInfo[convertToCamelCase(i[0] as string)] = i[1][0][0]
      })
    }

    return {
      uid: info[1],
      title: info[2],
      dateCreated: info[3],
      imageUrl: info[4],
      creator: info[6][0],
      ...otherInfo
    }
  }

  private areArtWorksEqual (artWork1: ArtWorkNormalize, artWork2: ArtWorkNormalize): boolean {
    return (
      artWork1.uid === artWork2.uid &&
      artWork1.title === artWork2.title &&
      artWork1.imageUrl === artWork2.imageUrl &&
      artWork1.creator === artWork2.creator &&
      artWork1.entityUrl === artWork2.entityUrl &&
      artWork1.creatorUid === artWork2.creatorUid &&
      artWork1.creatorLifespan === artWork2.creatorLifespan &&
      artWork1.creatorNationality === artWork2.creatorNationality &&
      artWork1.creatorGender === artWork2.creatorGender &&
      artWork1.creatorDeathPlace === artWork2.creatorDeathPlace &&
      artWork1.creatorBirthPlace === artWork2.creatorBirthPlace &&
      artWork1.dateCreated === artWork2.dateCreated &&
      artWork1.physicalDimensions === artWork2.physicalDimensions &&
      artWork1.originalTitle === artWork2.originalTitle &&
      artWork1.moreInfo === artWork2.moreInfo &&
      artWork1.creditLine === artWork2.creditLine &&
      artWork1.type === artWork2.type &&
      artWork1.externalLink === artWork2.externalLink &&
      artWork1.medium === artWork2.medium
    )
  }

  public async delay (ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms))
  }
}
