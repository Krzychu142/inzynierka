import jwt from 'jsonwebtoken'
import { Role } from '../types/role.enum'

interface User {
  _id: string
  email: string
  role: Role
  tokenVersion: number
}

class TokenService {
  static generateToken(user: User): string {
    const expiresIn = '15m'
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not defined')
    }

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn })
  }

  static generateTokenForEmailVerification(email: string): string {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
    const payload = {
      email: email,
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT_SECRET_KEY is not defined')
    }

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn })
  }

  static generateRefreshToken(user: User) {
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
    const payload = {
      id: user._id,
      tokenVersion: user.tokenVersion,
    }

    if (!process.env.JWT_SECRET_KEY_REFRESH) {
      throw new Error('JWT_SECRET_KEY_REFRESH is not defined')
    }

    return jwt.sign(payload, process.env.JWT_SECRET_KEY_REFRESH, { expiresIn })
  }

  static verifyToken(token: string, isAccessToken: boolean) {
    try {
      if (
        !process.env.ACCESS_TOKEN_SECRET ||
        !process.env.REFRESH_TOKEN_SECRET
      ) {
        throw new Error(
          'ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET is not defined',
        )
      }

      const secret = isAccessToken
        ? process.env.ACCESS_TOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET
      return jwt.verify(token, secret)
    } catch (error) {
      throw error
    }
  }
}

export default TokenService
