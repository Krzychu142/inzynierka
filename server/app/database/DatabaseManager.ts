import mongoose from 'mongoose'

// Singleton
export default class DatabaseManager {
  private static instance: DatabaseManager

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }

    return DatabaseManager.instance
  }

  public async connect(): Promise<void> {
    try {
      if (!process.env.DB_URI) {
        throw new Error('DB_URI is not defined')
      }

      await mongoose.connect(process.env.DB_URI).then(() => {
        console.log('Database connection successful')
      })
    } catch (error) {
      console.error('Database connection failed')
      process.exit()
    }
  }
}
