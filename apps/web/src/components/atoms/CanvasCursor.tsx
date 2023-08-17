import Image from 'next/image';
import React from 'react';

interface CanvasCursorProps {
    color?: string;
}

export default function CanvasCursor({color}: CanvasCursorProps) {
    return <div
        style={{
            width: 1,
            height: 1,
            backgroundColor: color || 'transparent'
        }}
        className={'relative select-none'}>
        <div
            style={{
                backgroundColor: color || 'transparent'
            }}
            className={'absolute top-0 left-0 w-full'}>
        </div>
        <Image
            width={1}
            height={1}
            src={"https://rplace.live/svg/pixel-select-2022.svg"}
            alt={'cursor'}
            className={'absolute top-0 left-0'}
            draggable={false}/>
    </div>
}