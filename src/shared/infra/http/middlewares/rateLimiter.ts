import { Request, Response, NextFunction } from "express";
import { Pool } from 'pg'
import { RateLimiterPostgres } from 'rate-limiter-flexible'

import AppError from '@shared/errors/AppError'

const postgresClient = new Pool({
  host: process.env.ORM_HOST,
  port: Number(process.env.ORM_PORT),
  database: process.env.ORM_DATABASE,
  user: process.env.ORM_USER,
  password: process.env.ORM_PASSWORD,
});

const limiter = new RateLimiterPostgres({
    storeClient: postgresClient,
    keyPrefix: 'ratelimit',
    points: 1000, // Number of points
    duration: 1, // Per second
  });

export default async function rateLimiter(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
        await limiter.consume(request.ip)

        return next()
    } catch (err) {
        throw new AppError('Too many requests', 429)
    }
}