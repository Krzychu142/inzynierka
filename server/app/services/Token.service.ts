import jwt from 'jsonwebtoken'
import IEmployee from '../types/employee.interface'

class TokenService {
  static generateToken(user: IEmployee): string {
    // 1 day of work
    const expiresIn = '8h'
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not defined')
    }

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn })
  }

  static generateTokenForEmailVerificationOrPasswordReset(email: string): string {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
    const payload = {
      email: email,
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not defined')
    }

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn })
  }

  static verifyToken(token: string, isAccessToken: boolean) {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      throw new Error(
        'ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET is not defined',
      )
    }

    const secret = isAccessToken
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET
    return jwt.verify(token, secret)
  }

  static verifyTokenForEmailVerificationOrPasswordReset(token: string) {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not defined')
    }

    return jwt.verify(token, process.env.JWT_SECRET_KEY)
  }
}

export default TokenService
