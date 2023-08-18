'use client'

import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import io, {Socket} from "socket.io-client";
import {SyncCanvasResponse} from 'shared/lib/model/sockets/syncCanvas.dto';
import {UpdatePixelRequest, UpdatePixelResponse} from 'shared/lib/model/sockets/updatePixel.dto';
import UpdateTimeoutResponse from 'shared/lib/model/sockets/updateTimeout.dto';

interface CanvasContextProps {
    canvasRef: React.RefObject<HTMLCanvasElement>,
    updatePixel: (x: number, y: number, color?: string) => void,
    currentTimeoutTime: number;
}

const CanvasContext = createContext<CanvasContextProps | null>(null)
export const useCanvasContext = () => useContext(CanvasContext) as CanvasContextProps;

export function CanvasProvider({children}: {children: React.ReactNode}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const socket = useRef<Socket | null>(null);
    const [currentTimeoutTime, setCurrentTimeoutTime] = useState(0);


    useEffect(() => {
        const createdSocket = io(`${process.env['NEXT_PUBLIC_API_WS_URL']}/canvas`);
        socket.current = createdSocket;

        createdSocket.on("error", (e) => {
            console.log(e)
        });

        createdSocket.on('syncCanvas', (payload: SyncCanvasResponse) => {
            if (!canvasRef.current) {
                return;
            }

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Canvas context not supported');
            }

            const imageData = ctx.createImageData( canvas.width, canvas.height);
            const data = new Uint32Array(imageData.data.buffer);
            const payloadData = new Uint32Array(payload);

            for (let i = 0; i < data.length; i++) {
                data[i] = payloadData[i];
            }

            ctx.putImageData(imageData, 0, 0);
        });

        createdSocket?.on('updateTimeout', (payload: UpdateTimeoutResponse) => {
            setCurrentTimeoutTime(payload.timeout);
        });

        createdSocket?.on('updatePixel', (payload: UpdatePixelResponse) => {
            updatePixelOnCanvas(payload.x, payload.y, payload.color);
        });

    }, []);

    const updatePixelOnCanvas = (x: number, y: number, color?: string) => {
        if (!canvasRef.current)
            return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error("Canvas not supported");
        }

        ctx.beginPath();
        ctx.fillStyle = color || 'black';
        ctx.fillRect(x, y, 1, 1);
        ctx.stroke();
    };

    const updatePixel = (x: number, y: number, color?: string) => {
        if (!canvasRef.current)
            return;

        updatePixelOnCanvas(x, y, color);
        const updatePixelRequest: UpdatePixelRequest = {
            x,
            y,
            color: color || '#ffffff'
        }

        socket.current?.emit('updatePixel', updatePixelRequest);

    };

    return (<CanvasContext.Provider value={{
        canvasRef,
        updatePixel,
        currentTimeoutTime
    }}>
        {children}
    </CanvasContext.Provider>)
}