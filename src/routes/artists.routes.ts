import express, { type Request, type Response, type Express } from 'express'
import { ArtistsService } from '../service/artists.service'
import { ArtistsController } from '../controllers/artists.controller'

const router = express.Router()

const artistsController = new ArtistsController(new ArtistsService())

router.get('/get-by-letter', (req: Request, res: Response): void => {
  void artistsController.getArtistsForLetter(req, res)
})

export const loadArtistsRoutes = (app: Express): void => {
  app.use('/artists', router)
}
