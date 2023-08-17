interface ColorTile {
    isActive?: boolean;
    color: string;
    borderColor?: string;
    onClick?: (color: string) => void;
}

export default function ColorTile({isActive, color, borderColor, onClick}: ColorTile) {
    return (
        <div style={{
            backgroundColor: color,
            minWidth: '50px',
            borderColor: borderColor,
            borderWidth: borderColor ? 1 : undefined}}
             className={`h-10 cursor-pointer`}
             onClick={() => onClick && onClick(color)}
        ></div>
    )
}