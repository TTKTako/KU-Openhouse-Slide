import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

let io: SocketIOServer | undefined;

export const initSocket = (server: NetServer) => {
  if (!io) {
    io = new SocketIOServer(server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join room based on client type
      socket.on('join-room', (data: { room: string }) => {
        socket.join(data.room);
        console.log(`Socket ${socket.id} joined room: ${data.room}`);
      });

      socket.on('next-slide', () => {
        console.log('Next slide command received - broadcasting to all displays');
        // Broadcast to all connected clients (all displays)
        io?.emit('slide-change', { action: 'next' });
      });

      socket.on('prev-slide', () => {
        console.log('Previous slide command received - broadcasting to all displays');
        io?.emit('slide-change', { action: 'prev' });
      });

      socket.on('reset', () => {
        console.log('Reset command received - broadcasting to all displays');
        io?.emit('slide-change', { action: 'reset' });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  return io;
};

export const getIO = () => io;
