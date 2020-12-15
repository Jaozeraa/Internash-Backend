declare namespace Express {
  export interface Request {
    user: {
      id: string;
    }

    io: import('socket.io').Server;
    connectedUsers: {
      [key: string]: any;
    }
  }
}