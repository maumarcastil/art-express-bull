import express, { type Express } from 'express'

import { ArtWorkService } from '../service/artWork.service'

import { ArtWorkController } from '../controllers/artWork.controller'

const router = express.Router()

const artWorkController = new ArtWorkController(new ArtWorkService())

router.get('/get-by-artist', (req, res): void => {
  void artWorkController.getArtWorksByArtist(req, res)
})

export const loadArtWorkRoutes = (app: Express): void => {
  app.use('/artwork', router)
}
