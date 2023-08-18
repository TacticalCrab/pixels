import { type Socket } from 'socket.io';

export interface CanvasSocket extends Socket {
    timestamp: number;
}