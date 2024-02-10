export interface ArtWorkBasicNormalize {
  uid: string
  artistUid: string
  title: string
  artistName: string
  imageUrl: string
  entityUrl: string
}

export interface ArtWorkNormalize {
  uid: string
  title: string
  imageUrl: string
  creator: string
  entityUrl: string
  creatorUid: string
  creatorLifespan?: string
  creatorNationality?: string
  creatorGender?: string
  creatorDeathPlace?: string
  creatorBirthPlace?: string
  dateCreated?: string
  physicalDimensions?: string
  originalTitle?: string
  moreInfo?: string
  creditLine?: string
  type?: string
  externalLink?: string
  medium?: string
}
