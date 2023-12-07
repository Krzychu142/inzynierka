class CustomError extends Error {
  private code = 500

  constructor(message: string, code: number = 500) {
    super(message)
    if (code) {
      this.code = code
    }
  }

  getStatusCode = (): number => {
    return this.code
  }
}

export default CustomError
