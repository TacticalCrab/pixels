import React from 'react';

interface KnotProps {
    children: React.ReactNode;
    className?: string;
}

export default function Knot({children, className}: KnotProps) {
    return (
        <span
            className={[
                'px-5 py-1 bg-white rounded-xl drop-shadow',
                className
            ].join(' ')}>
            {children}
        </span>
    )
}