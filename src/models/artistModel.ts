import mongoose from 'mongoose'

import type { ArtistNormalize } from '../interface/artists'

export interface ArtistDocument extends ArtistNormalize, Document {}

const MoreInfoSchema = new mongoose.Schema({
  source: String,
  url: String
})

const artistsSchema = new mongoose.Schema({
  uid: String,
  name: String,
  itemCount: Number,
  imageUrl: String,
  datesOfLife: String,
  entityUrl: String,
  bio: String,
  moreInfo: MoreInfoSchema
},
{
  timestamps: true
})

const ArtistModel = mongoose.model<ArtistDocument>('Artists', artistsSchema)

export default ArtistModel
