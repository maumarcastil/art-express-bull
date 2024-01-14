import { type Express } from 'express'

export const initExpressServer = (app: Express, port: number): void => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}
