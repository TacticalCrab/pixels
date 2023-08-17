'use client';
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import Image from 'next/image';
import Canvas from '@/components/atoms/Canvas/Canvas';
import Knot from '@/components/atoms/Knot';
import Bar from '@/components/atoms/Bar';
import {ColorPicker} from '@/components/atoms/ColorPicker';
import {useCanvasContext} from '@/contexts/CanvasContext';

function canvasRatio(clientOffset: number, offset: number, canvasSize: number) {
    return (clientOffset - offset) / canvasSize;
}

function getCanvasPositionByRatio(canvasSize: number, ratio: number) {
    return canvasSize * ratio;
}

interface CanvasInterface {}

const maxZoom = 50000;
const minZoom = 800;
const initialCanvasSize = 1000;

export default function CanvasInterface() {
    const {canvasRef, updatePixel} = useCanvasContext();

    const [canvasOffset, setCanvasOffset] = useState({x: 0, y: 0});
    const [canvasSize, setCanvasSize] = useState<number>(minZoom);
    const [cursorStyle, setCursorStyle] = useState('cursor-auto');
    const [cursorPos, setCursorPos] = useState({x: 0, y: 0});
    const [selectedColor, setSelectedColor] = useState('');

    const previousCords = useRef<{x: number, y: number} | null>(null);
    const isMoving = useRef(false);

    const onePixelSize = canvasSize / initialCanvasSize;

    const onWheelCallback = (e: React.WheelEvent) => {
        let sign = 1;
        if (e.deltaY < 0) sign = -sign;
        let newCanvasSize = Math.round(canvasSize + (canvasSize * 0.6 * -sign));

        if (newCanvasSize > maxZoom) newCanvasSize = maxZoom;
        if (newCanvasSize < minZoom) newCanvasSize = minZoom;

        setCanvasSize(newCanvasSize);

        const currentCanvasRatioX = canvasRatio(e.clientX, canvasOffset.x, canvasSize);
        const currentCanvasRatioY = canvasRatio(e.clientY, canvasOffset.y, canvasSize);
        const newCanvasPosX = getCanvasPositionByRatio(newCanvasSize, currentCanvasRatioX);
        const newCanvasPoxY = getCanvasPositionByRatio(newCanvasSize, currentCanvasRatioY);

        const offsetX = Math.round(newCanvasPosX - (e.clientX - canvasOffset.x));
        const offsetY = Math.round(newCanvasPoxY - (e.clientY - canvasOffset.y));

        setCanvasOffset({
            x: canvasOffset.x - offsetX,
            y: canvasOffset.y - offsetY
        });
    };
    const onMouseMoveCallback = (e: React.MouseEvent) => {
        if (isMoving.current) {
            if (previousCords.current) {
                const x = e.clientX - previousCords.current.x;
                const y = e.clientY - previousCords.current.y;
                setCanvasOffset({
                    x: canvasOffset.x + x,
                    y: canvasOffset.y + y
                });
            }

            previousCords.current = {
                x: e.clientX,
                y: e.clientY
            }
        }
    };
    const onMouseUpCallback = (e: React.MouseEvent) => {
        isMoving.current = false;
        previousCords.current = null;
        setCursorStyle('cursor-auto');
    };
    const onMouseDownCallback = (e: React.MouseEvent) => {
        isMoving.current = true;
        setCursorStyle('cursor-grabbing');
    };
    const onKeyDownCallback = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case 'Enter':
                updatePixel(cursorPos.x, cursorPos.y, selectedColor);
                break;
            case 'ArrowRight':
                setCanvasOffset({
                   x: canvasOffset.x - onePixelSize,
                   y: canvasOffset.y
                });
                break;
            case 'ArrowLeft':
                setCanvasOffset({
                    x: canvasOffset.x + onePixelSize,
                    y: canvasOffset.y
                });
                break;
            case 'ArrowUp':
                setCanvasOffset({
                    x: canvasOffset.x,
                    y: canvasOffset.y + onePixelSize
                });
                break;
            case 'ArrowDown':
                setCanvasOffset({
                    x: canvasOffset.x,
                    y: canvasOffset.y - onePixelSize
                });
                break;
        }

    }, [cursorPos, selectedColor, canvasOffset, updatePixel, setCanvasOffset, onePixelSize]);

    useLayoutEffect(() => {
        setCanvasOffset({
            x: Math.round(window.innerWidth / 2 - canvasSize / 2),
            y: Math.round(window.innerHeight / 2 - canvasSize / 2)
        });
    }, [canvasSize]);

    useEffect(() => {
        let xPos = Math.floor((((window.innerWidth) / 2) - canvasOffset.x) / (canvasSize / initialCanvasSize));
        let yPos = Math.floor((((window.innerHeight) / 2) - canvasOffset.y) / (canvasSize / initialCanvasSize));

        if (xPos < 0) xPos = 0;
        if (yPos < 0) yPos = 0;

        if (xPos > initialCanvasSize - 1) xPos = initialCanvasSize - 1;
        if (yPos > initialCanvasSize - 1) yPos = initialCanvasSize - 1;

        setCursorPos({
            x: xPos,
            y: yPos
        });
    }, [canvasOffset, canvasSize]);

    useEffect(() => {
        window.addEventListener('keydown', onKeyDownCallback);
        return () => {
            window.removeEventListener('keydown', onKeyDownCallback);
        }
    }, [onKeyDownCallback]);

    return (
        <div
            onWheel={onWheelCallback}
            onMouseMove={onMouseMoveCallback}
            onMouseUp={onMouseUpCallback}
            // onMouseOut={onMouseUpCallback}
            className={`overflow-hidden w-full h-full ${cursorStyle} bg-zinc-700 relative`}>
            <div className={'absolute w-full h-full top-0 left-0 z-50 pointer-events-none select-none flex flex-col justify-between'}>
                <Bar className={'p-2'}>
                    <Knot>
                        <span className={'text-black w-20 inline-block text-center'}>
                            {`(${cursorPos.x}, ${cursorPos.y})`}
                        </span>
                    </Knot>
                </Bar>
                <Bar className={'p-2'}>
                    <Knot className={'pointer-events-auto w-screen flex-col'}>
                        <ColorPicker
                            value={selectedColor}
                            onChange={(color) => setSelectedColor(color)}/>
                        <div className={'flex justify-center pb-1'}>
                            <button
                                type={'button'}
                                className={'shadow text-black border-2 border-black px-4 py-0.5 rounded'}
                                onClick={() => updatePixel(cursorPos.x, cursorPos.y, selectedColor)}>
                                Place Tile
                            </button>
                        </div>
                    </Knot>
                </Bar>
            </div>

            <div
                style={{
                    transformOrigin: 'top left',
                    transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasSize / initialCanvasSize})`,
                    width: `${initialCanvasSize}px`,
                    height: `${initialCanvasSize}px`
                }}
                className={`w-full h-full absolute top-0 left-0 z-30`}
                onMouseDown={onMouseDownCallback}>
            </div>
            <div
                style={{
                    transformOrigin: 'top left',
                    transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasSize / initialCanvasSize})`,
                    width: `${initialCanvasSize}px`,
                    height: `${initialCanvasSize}px`
                }}
                className={`w-full h-full top-0 left-0 z-20 relative`}>
                <div
                    style={{
                        marginLeft: cursorPos.x,
                        marginTop: cursorPos.y,
                        width: 1,
                        height: 1,
                        backgroundColor: selectedColor
                    }}
                    className={'h-1 w-1 absolute top-0 left-0'}>
                </div>
                <Image
                    style={{
                        marginLeft: cursorPos.x,
                        marginTop: cursorPos.y,
                    }}
                    width={1}
                    height={1}
                    src={"https://rplace.live/svg/pixel-select-2022.svg"}
                    alt={'cursor'}
                    className={'h-1 w-1 absolute top-0 left-0'} />
            </div>
            <div
                style={{
                    transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
                    width: `${canvasSize}px`,
                    height: `${canvasSize}px`
                }}
                className={`w-full h-full absolute top-0 left-0 z-10`}>
                <Canvas canvasRef={canvasRef} size={initialCanvasSize} />
            </div>
        </div>
    )
}