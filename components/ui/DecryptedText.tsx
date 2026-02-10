import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface DecryptedTextProps {
    text: string;
    speed?: number;
    maxIterations?: number;
    sequential?: boolean;
    revealDirection?: "start" | "end" | "center";
    useOriginalCharsOnly?: boolean;
    characters?: string;
    className?: string;
    parentClassName?: string;
    animateOn?: "view" | "hover";
    [key: string]: any;
}

export default function DecryptedText({
    text,
    speed = 50,
    maxIterations = 10,
    sequential = false,
    revealDirection = "start",
    useOriginalCharsOnly = false,
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+",
    className = "",
    parentClassName = "",
    animateOn = "hover",
    ...props
}: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isHovering, setIsHovering] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (animateOn === "view" && !isRevealed) {
            startAnimation();
        }
    }, [animateOn]);

    const startAnimation = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRevealed(false);

        let iteration = 0;
        const originalChars = text.split("");

        intervalRef.current = window.setInterval(() => {
            setDisplayText(
                originalChars
                    .map((char, index) => {
                        if (char === " ") return " ";
                        if (iteration > maxIterations) {
                            return char;
                        }
                        return characters[Math.floor(Math.random() * characters.length)];
                    })
                    .join("")
            );

            iteration++;
            if (iteration > maxIterations) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setDisplayText(text);
                setIsRevealed(true);
            }
        }, speed);
    };

    const handleMouseEnter = () => {
        if (animateOn === "hover") {
            setIsHovering(true);
            startAnimation();
        }
    };

    return (
        <span
            className={parentClassName}
            onMouseEnter={handleMouseEnter}
            {...props}
        >
            <span className={className}>{displayText}</span>
        </span>
    );
}
