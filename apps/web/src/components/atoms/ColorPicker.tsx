import React from 'react';
import ColorTile from '@/components/atoms/ColorTile';

interface ColorPickerProps {
    onChange?: (color: string) => void;
    value?: string;
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
export function ColorPicker({onChange, value}: ColorPickerProps) {
    return <div className={'w-full bg-white'}>
        <div className={'flex justify-start gap-2 flex-wrap p-2'}>
            {colors.map((color) => {
                return <ColorTile
                    key={color}
                    color={color}
                    onClick={(color) => {
                        onChange && onChange(color);
                    }}
                    borderColor={color === '#ffffff' ? 'gray' : undefined}/>
            })}
        </div>
    </div>
}