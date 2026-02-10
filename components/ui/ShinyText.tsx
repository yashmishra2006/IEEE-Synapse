import React, { useMemo } from "react";

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
    text,
    disabled = false,
    speed = 5,
    className = ""
}) => {
    const animationDuration = useMemo(() => `${speed}s`, [speed]);

    return (
        <div
            className={`shiny-text ${disabled ? "disabled" : ""} ${className}`}
            style={{ animationDuration }}
        >
            {text}
        </div>
    );
};

export default ShinyText;
