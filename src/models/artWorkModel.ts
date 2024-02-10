import mongoose from 'mongoose'

import { type ArtWorkNormalize } from '../interface/artWork'

export interface ArtWorkDocument extends ArtWorkNormalize, Document {}

const artWorkSchema = new mongoose.Schema({
  uid: String,
  title: String,
  imageUrl: String,
  creator: String,
  entityUrl: String,
  creatorUid: String,
  creatorLifespan: { type: String, required: false },
  creatorNationality: { type: String, required: false },
  creatorGender: { type: String, required: false },
  creatorDeathPlace: { type: String, required: false },
  creatorBirthPlace: { type: String, required: false },
  dateCreated: { type: String, required: false },
  physicalDimensions: { type: String, required: false },
  originalTitle: { type: String, required: false },
  moreInfo: { type: String, required: false },
  creditLine: { type: String, required: false },
  type: { type: String, required: false },
  externalLink: { type: String, required: false },
  medium: { type: String, required: false }

}, { timestamps: true })

const ArtWorkModel = mongoose.model<ArtWorkDocument>('ArtWork', artWorkSchema)

export default ArtWorkModel
