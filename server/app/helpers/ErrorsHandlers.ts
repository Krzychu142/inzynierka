class ErrorsHandlers {
  static errorMessageHandler(error: unknown): { message: string } {
    if (error instanceof Error) {
      return { message: error.message }
    } else {
      return { message: 'Something went wrong' }
    }
  }
}

export default ErrorsHandlers
