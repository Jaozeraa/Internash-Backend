import 'reflect-metadata'
import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import socketIo from 'socket.io';
import cors from 'cors'
import 'express-async-errors';

import '@shared/infra/typeorm'
import '@shared/container'
import uploadConfig from '@config/upload'
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter'
import routes from './routes'

const app = express();
const server = createServer(app);
const io = socketIo(server);

interface IConnectedUsers {
  [key: string]: any;
}

const connectedUsers: IConnectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;
  connectedUsers[user] = socket.id;

  socket.on('disconnect', () => {
    delete connectedUsers[user];
  })
});

app.use(rateLimiter)

app.use(cors())

app.use(express.json())

app.use('/files', express.static(uploadConfig.uploadsFolder))

app.use((request, response, next) => {
  request.io = io;
  request.connectedUsers = connectedUsers;

  return next();
})
app.use(routes)

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {  
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  console.log(error);

  return response.status(500).json({ status: 'error', message: 'Internal server error.' });
})

const port = process.env.PORT || 3333;

server.listen(port, () => {
  console.log(`🖥 Server running on port ${port}`);
})
