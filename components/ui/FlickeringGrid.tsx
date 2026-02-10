import React, { useEffect, useRef, useState, useCallback } from "react";

interface FlickeringGridProps {
    squareSize?: number;
    gridGap?: number;
    flickerChance?: number;
    color?: string;
    width?: number;
    height?: number;
    className?: string;
    maxOpacity?: number;
}

const FlickeringGrid: React.FC<FlickeringGridProps> = ({
    squareSize = 4,
    gridGap = 6,
    flickerChance = 0.3,
    color = "rgb(0, 0, 0)",
    width,
    height,
    className,
    maxOpacity = 0.3,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const memoizedColor = React.useMemo(() => {
        const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            return `${match[1]}, ${match[2]}, ${match[3]}`;
        }
        return "0, 0, 0";
    }, [color]);

    const setupCanvas = useCallback(
        (canvas: HTMLCanvasElement, width: number, height: number) => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.scale(dpr, dpr);
            }

            const cols = Math.floor(width / (squareSize + gridGap));
            const rows = Math.floor(height / (squareSize + gridGap));

            const squares = new Float32Array(cols * rows);
            for (let i = 0; i < squares.length; i++) {
                squares[i] = Math.random() * maxOpacity;
            }

            return { ctx, cols, rows, squares };
        },
        [squareSize, gridGap, maxOpacity],
    );

    const updateSquares = useCallback(
        (squares: Float32Array, flickerChance: number) => {
            for (let i = 0; i < squares.length; i++) {
                if (Math.random() < flickerChance) {
                    squares[i] = Math.random() * maxOpacity;
                }
            }
        },
        [maxOpacity],
    );

    const drawGrid = useCallback(
        (
            ctx: CanvasRenderingContext2D,
            width: number,
            height: number,
            cols: number,
            rows: number,
            squares: Float32Array,
            dpr: number,
        ) => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const opacity = squares[i * rows + j];
                    ctx.fillStyle = `rgba(${memoizedColor}, ${opacity})`;
                    ctx.fillRect(
                        i * (squareSize + gridGap),
                        j * (squareSize + gridGap),
                        squareSize,
                        squareSize,
                    );
                }
            }
        },
        [memoizedColor, squareSize, gridGap],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setContainerSize({ width, height });
            }
        });

        resizeObserver.observe(canvas.parentElement!);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const { width: canvasWidth, height: canvasHeight } = containerSize;
        if (canvasWidth === 0 || canvasHeight === 0) return;

        const { ctx, cols, rows, squares } = setupCanvas(
            canvas,
            canvasWidth,
            canvasHeight,
        );
        if (!ctx) return;

        let animationFrameId: number;

        const animate = () => {
            updateSquares(squares, flickerChance);
            drawGrid(ctx, canvasWidth, canvasHeight, cols, rows, squares, window.devicePixelRatio);
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [containerSize, setupCanvas, updateSquares, drawGrid, flickerChance]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{
                width: "100%",
                height: "100%",
            }}
        />
    );
};

export default FlickeringGrid;
