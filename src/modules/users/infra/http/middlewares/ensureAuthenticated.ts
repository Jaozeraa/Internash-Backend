import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import authConfig from '@config/auth'
import AppError from '@shared/errors/AppError'

interface ITokenPayload {
    iat: number
    exp: number
    sub: string
}

export default function ensureAuthenticated (request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization
    if(!authHeader) {
        throw new AppError ('JWT token is missing', 401)
    }

    const { secret } = authConfig.jwt

    const [, token ] = authHeader.split(' ')

    try {
        const decoded = verify(token, secret)

        const { sub } = decoded as ITokenPayload
        
        request.user = {
            id: sub
        }
    } catch {
        throw new AppError ('invalid JWT token', 401)
    }

    return next()
}