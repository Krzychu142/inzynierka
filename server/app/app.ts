import DatabaseManager from './database/DatabaseManager'
import dotenv from 'dotenv'
import express, { Express } from 'express'
import cors from 'cors'
import routes from './routes/routes'
import RequestLogger from './utils/RequestLogger'
dotenv.config()

export default class App {
  private static instance: App
  private databaseManager: DatabaseManager
  private app: Express
  private port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000

  private constructor() {
    this.databaseManager = DatabaseManager.getInstance()
    this.app = express()
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(RequestLogger.logRequest)
    this.app.use(routes)
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App()
    }
    return App.instance
  }

  public async start(): Promise<void> {
    try {
      await this.databaseManager.connect()
      this.app.listen(this.port, () => {
        console.log(`App listening on the port ${this.port}`)
      })
    } catch (error) {
      console.error('Failed to start the app:', error)
      process.exit(1)
    }
  }
}
