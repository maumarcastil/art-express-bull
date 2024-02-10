export interface ArtistBasicNormalize {
  uid: string
  name: string
  itemCount: string
  imageUrl: string
  entityUrl: string
}

export interface ArtistNormalize {
  uid: string
  name: string
  itemCount: number
  imageUrl: string
  datesOfLife?: string
  entityUrl: string
  bio?: string
  moreInfo?: {
    source: string
    url: string
  }
}
