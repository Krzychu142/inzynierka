import DatabaseManager from './database/DatabaseManager'
import dotenv from 'dotenv'
dotenv.config()

export default class App {
  private static instance: App
  private databaseManager: DatabaseManager

  private constructor() {
    this.databaseManager = DatabaseManager.getInstance()
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
    } catch (error) {
      console.error('Failed to start the app:', error)
      process.exit(1)
    }
  }
}
