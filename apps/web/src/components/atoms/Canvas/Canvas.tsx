'use client'
import style from './Canvas.module.css';
import React, {useEffect, useRef} from 'react';

interface CanvasProps {
    size: number;
    canvasRef?: React.RefObject<HTMLCanvasElement>;
}

const colors = [
    "#6d001a",
    "#be0039",
    "#ff4500",
    "#ffa800",
    "#ffd635",
    "#fff8b8",
    "#00a368",
    "#00cc78",
    "#7eed56",
    "#00756f",
    "#009aa5",
    "#00ccc0",
    "#2450a4",
    "#3690ea",
    "#51e9f4",
    "#493ac1",
    "#6a5cff",
    "#94b3ff",
    "#811e9f",
    "#b44ac0",
    "#e4abff",
    "#de107f",
    "#ff3881",
    "#ff99aa",
    "#6d482f",
    "#9c6926",
    "#ffb470",
    "#000000",
    "#515252",
    "#898d90",
    "#d4d7d9",
    "#ffffff"
];

export default function Canvas({size, canvasRef}: CanvasProps) {
    useEffect(() => {
        if (!canvasRef) {
            return;
        }

        if (!canvasRef?.current) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error("Canvas not supported");
        }

        // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // const data = new Uint32Array(imageData.data.buffer);
        //
        // for (let i = 0; i < imageData.width ** 2; i++) {
        //     const colorIndex = Math.round(Math.random() * (colors.length - 1));
        //     const color = colors[colorIndex].replace('#', '');
        //     const reverseColor = [color.slice(0, 2), color.slice(2, 4), color.slice(4)].reverse().join('');
        //     const canvasColor = '0xff' + reverseColor;
        //     data[i] = parseInt(canvasColor);
        // }
        //
        // ctx.putImageData(imageData, 0, 0);
    }, [canvasRef]);

    return (
        <canvas
            width={size}
            height={size}
            className={style.canvas}
            ref={canvasRef}>
            You need JavaScript to use canvas!
        </canvas>
    )
}