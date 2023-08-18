import React, {Children} from 'react';

interface ChingchangProps {
    children: React.ReactNode;
    className?: string;
}

export default function Bar({children, className}: ChingchangProps) {
    let conditionStyle = '';
    const childrenCount = Children.count(children);

    if (childrenCount === 1) {
        conditionStyle = 'flex justify-center items-center';
    } else if (childrenCount >= 2) {
        conditionStyle = 'flex justify-between items-center';
    }

    return (
        <div
            className={[conditionStyle, className].join(' ')}>
            {children}
        </div>
    )
}