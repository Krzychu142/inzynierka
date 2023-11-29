import { MongoError } from "mongodb";

class ErrorsHandlers {
  static errorMessageHandler(error: unknown): { message: string } {
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: 'Something went wrong' };
  }

  static handleMongoError(error: unknown): never {
    if (error instanceof MongoError && error.code === 11000) {
        throw new Error('Duplicate key error');
    } else {
        throw new Error(ErrorsHandlers.errorMessageHandler(error).message);
    }
  }
}

export default ErrorsHandlers
