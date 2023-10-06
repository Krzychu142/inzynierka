declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      DB_URI: string
      JWT_SECRET_KEY: string
      JWT_SECRET_KEY_REFRESH: string
      JWT_EXPIRES_IN: string
      EMAIL_PASSWORD: string
      EMAIL_ADRESS: string
      STRIPE_SECRET_KEY: string
      CLIENT_URL: string
      STRIPE_ENDPOINT_SECRET: string
    }
  }
}
