import React from 'react';

interface InterfaceButtonProps {
    onClick?: (e: React.MouseEvent) => void;
}

export default function InterfaceButton({onClick}: InterfaceButtonProps) {
    return (
        <button onClick={onClick}>
        </button>
    )
}