"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface ExamCalculatorProps {
    isOpen: boolean;
    onClose: () => void;
    initialMinimized?: boolean;
}

function safeCalculate(expression: string): string {
    try {
        const sanitized = expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .trim();

        if (!/^[0-9+\-*/. ()]+$/.test(sanitized)) {
            return "Error";
        }

        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${sanitized});`)();

        if (result === undefined || isNaN(result) || !isFinite(result)) {
            return "Error";
        }

        // Limit floating point inaccuracies, e.g. 0.1 + 0.2 = 0.30000000000000004
        const rounded = Math.round(result * 1e8) / 1e8;
        return String(rounded);
    } catch {
        return "Error";
    }
}

export default function ExamCalculator({
    isOpen,
    onClose,
    initialMinimized = false,
}: ExamCalculatorProps) {
    const [display, setDisplay] = useState<string>("0");
    const [equation, setEquation] = useState<string>("");
    const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
    const [isMinimized, setIsMinimized] = useState<boolean>(initialMinimized);

    // Draggable position state
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(
        null
    );
    const containerRef = useRef<HTMLDivElement>(null);

    // Initialize default position on client mount (upper right corner of viewport)
    useEffect(() => {
        if (typeof window !== "undefined" && position === null) {
            const width = window.innerWidth;
            const defaultX = Math.max(16, width - 320);
            const defaultY = 88;
            setPosition({ x: defaultX, y: defaultY });
        }
    }, [position]);

    // Handle number clicks
    const handleDigit = useCallback(
        (digit: string) => {
            if (isNewNumber || display === "0" || display === "Error") {
                setDisplay(digit);
                setIsNewNumber(false);
            } else {
                if (display.length < 14) {
                    setDisplay(display + digit);
                }
            }
        },
        [display, isNewNumber]
    );

    // Handle decimal point
    const handleDecimal = useCallback(() => {
        if (isNewNumber || display === "Error") {
            setDisplay("0.");
            setIsNewNumber(false);
        } else if (!display.includes(".")) {
            setDisplay(display + ".");
            setIsNewNumber(false);
        }
    }, [display, isNewNumber]);

    // Handle operators (+, -, *, /)
    const handleOperator = useCallback(
        (op: string) => {
            if (display === "Error") return;

            if (equation && !isNewNumber) {
                // Evaluate previous step before chaining next operator
                const result = safeCalculate(`${equation} ${display}`);
                setEquation(`${result} ${op}`);
                setDisplay(result);
            } else {
                setEquation(`${display} ${op}`);
            }
            setIsNewNumber(true);
        },
        [display, equation, isNewNumber]
    );

    // Handle Equals (=)
    const handleEquals = useCallback(() => {
        if (!equation || display === "Error") return;

        const fullExpr = `${equation} ${display}`;
        const result = safeCalculate(fullExpr);
        setDisplay(result);
        setEquation("");
        setIsNewNumber(true);
    }, [display, equation]);

    // Handle DEL (backspace)
    const handleDelete = useCallback(() => {
        if (isNewNumber || display === "Error") {
            setDisplay("0");
            setIsNewNumber(true);
            return;
        }

        if (display.length > 1) {
            setDisplay(display.slice(0, -1));
        } else {
            setDisplay("0");
            setIsNewNumber(true);
        }
    }, [display, isNewNumber]);

    // Handle Clear (C)
    const handleClear = useCallback(() => {
        setDisplay("0");
        setEquation("");
        setIsNewNumber(true);
    }, []);

    // Global keyboard support when calculator is open
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is currently typing in an input or textarea
            const target = e.target as HTMLElement;
            if (
                target &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.isContentEditable)
            ) {
                return;
            }

            if (e.key >= "0" && e.key <= "9") {
                e.preventDefault();
                handleDigit(e.key);
            } else if (e.key === ".") {
                e.preventDefault();
                handleDecimal();
            } else if (e.key === "+") {
                e.preventDefault();
                handleOperator("+");
            } else if (e.key === "-") {
                e.preventDefault();
                handleOperator("-");
            } else if (e.key === "*") {
                e.preventDefault();
                handleOperator("*");
            } else if (e.key === "/") {
                e.preventDefault();
                handleOperator("/");
            } else if (e.key === "Enter" || e.key === "=") {
                e.preventDefault();
                handleEquals();
            } else if (e.key === "Backspace") {
                e.preventDefault();
                handleDelete();
            } else if (e.key === "Escape" || e.key.toLowerCase() === "c") {
                e.preventDefault();
                handleClear();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        isOpen,
        handleDigit,
        handleDecimal,
        handleOperator,
        handleEquals,
        handleDelete,
        handleClear,
    ]);

    // Mouse / Touch Dragging logic
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("button")) return;
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            posX: position?.x || 0,
            posY: position?.y || 0,
        };
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest("button")) return;
        if (e.touches.length === 1) {
            setIsDragging(true);
            dragRef.current = {
                startX: e.touches[0].clientX,
                startY: e.touches[0].clientY,
                posX: position?.x || 0,
                posY: position?.y || 0,
            };
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !dragRef.current) return;
            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;

            const newX = Math.max(8, Math.min(window.innerWidth - 290, dragRef.current.posX + dx));
            const newY = Math.max(16, Math.min(window.innerHeight - 100, dragRef.current.posY + dy));

            setPosition({ x: newX, y: newY });
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging || !dragRef.current || e.touches.length !== 1) return;
            const dx = e.touches[0].clientX - dragRef.current.startX;
            const dy = e.touches[0].clientY - dragRef.current.startY;

            const newX = Math.max(8, Math.min(window.innerWidth - 290, dragRef.current.posX + dx));
            const newY = Math.max(16, Math.min(window.innerHeight - 100, dragRef.current.posY + dy));

            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            dragRef.current = null;
        };

        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchmove", handleTouchMove);
            window.addEventListener("touchend", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [isDragging]);

    if (!isOpen) return null;

    // MINIMIZED VIEW
    if (isMinimized) {
        return (
            <div
                ref={containerRef}
                style={{
                    left: position ? `${position.x}px` : "auto",
                    top: position ? `${position.y}px` : "88px",
                    right: position ? "auto" : "24px",
                }}
                className="fixed z-40 select-none shadow-lg animate-fadeIn"
            >
                <div
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    className="flex items-center gap-2.5 bg-[#F4F5F7] border border-[#D1D5DB] rounded-xl px-3.5 py-2 cursor-grab active:cursor-grabbing hover:shadow-xl transition-shadow"
                >
                    <div className="flex items-center gap-1.5 text-neutral-800 font-semibold text-xs sm:text-sm">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-neutral-700"
                        >
                            <rect width="16" height="20" x="4" y="2" rx="2" />
                            <line x1="8" x2="16" y1="6" y2="6" />
                            <line x1="16" x2="16" y1="14" />
                            <line x1="16" x2="16" y1="18" />
                            <line x1="8" x2="8.01" y1="10" />
                            <line x1="12" x2="12.01" y1="10" />
                            <line x1="16" x2="16.01" y1="10" />
                            <line x1="8" x2="8.01" y1="14" />
                            <line x1="12" x2="12.01" y1="14" />
                            <line x1="8" x2="8.01" y1="18" />
                            <line x1="12" x2="12.01" y1="18" />
                        </svg>
                        <span>Calculator</span>
                        <span className="text-[11px] font-mono text-neutral-500 bg-white border border-neutral-200 px-1.5 py-0.5 rounded">
                            {display}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 ml-1">
                        {/* Expand button */}
                        <button
                            type="button"
                            onClick={() => setIsMinimized(false)}
                            className="p-1 hover:bg-neutral-200 rounded text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                            title="Expand Calculator"
                            aria-label="Expand Calculator"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="15 3 21 3 21 9" />
                                <polyline points="9 21 3 21 3 15" />
                                <line x1="21" y1="3" x2="14" y2="10" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                        </button>

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-4 h-4 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white flex items-center justify-center cursor-pointer transition-colors"
                            title="Close Calculator"
                            aria-label="Close Calculator"
                        >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // FULL EXPANDED VIEW (matching user screenshot)
    return (
        <div
            ref={containerRef}
            style={{
                left: position ? `${position.x}px` : "auto",
                top: position ? `${position.y}px` : "88px",
                right: position ? "auto" : "24px",
            }}
            className="fixed z-40 select-none shadow-2xl animate-fadeIn"
        >
            <div className="w-[270px] sm:w-[280px] bg-[#F4F5F7] border border-[#D1D5DB] rounded-xl p-3.5 sm:p-4 shadow-xl flex flex-col">
                {/* Title Bar (Draggable Header) */}
                <div
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    className="flex items-center justify-between pb-2 mb-2 cursor-grab active:cursor-grabbing border-b border-transparent hover:border-neutral-200 transition-colors"
                >
                    <span className="text-sm font-semibold text-neutral-800">
                        Calculator
                    </span>

                    <div className="flex items-center gap-2">
                        {/* Minimize Button */}
                        <button
                            type="button"
                            onClick={() => setIsMinimized(true)}
                            className="p-1 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/80 rounded transition-colors cursor-pointer"
                            title="Minimize Calculator"
                            aria-label="Minimize Calculator"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>

                        {/* Close Button (Red Circle with White X as in screenshot) */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-4.5 h-4.5 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                            title="Close Calculator"
                            aria-label="Close Calculator"
                        >
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Display Screen */}
                <div className="bg-white border border-[#D1D5DB] rounded-md px-3 py-2 flex flex-col justify-end min-h-[46px] shadow-inner mb-3">
                    {equation && (
                        <span className="text-[10px] font-mono text-neutral-400 text-right truncate leading-tight">
                            {equation}
                        </span>
                    )}
                    <span className="text-xl sm:text-2xl font-mono font-medium text-neutral-900 text-right truncate leading-none">
                        {display}
                    </span>
                </div>

                {/* Buttons Grid (4 Columns, matching screenshot) */}
                <div className="grid grid-cols-4 gap-2">
                    {/* Row 1: + | DEL | C | * */}
                    <button
                        type="button"
                        onClick={() => handleOperator("+")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-base font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        +
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-xs font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        DEL
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-xs font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        C
                    </button>
                    <button
                        type="button"
                        onClick={() => handleOperator("*")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-base font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        *
                    </button>

                    {/* Row 2: / | 7 | 8 | 9 */}
                    <button
                        type="button"
                        onClick={() => handleOperator("/")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-base font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        /
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDigit("7")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-sm font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        7
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDigit("8")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-sm font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        8
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDigit("9")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-sm font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        9
                    </button>

                    {/* Row 3: - | 4 | 5 | 6 */}
                    <button
                        type="button"
                        onClick={() => handleOperator("-")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-base font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        -
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDigit("4")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-sm font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        4
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDigit("5")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-sm font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        5
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDigit("6")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-sm font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        6
                    </button>

                    {/* Row 4: 1 | 2 | 3 | . */}
                    <button
                        type="button"
                        onClick={() => handleDigit("1")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-sm font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        1
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDigit("2")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-sm font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        2
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDigit("3")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-sm font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        3
                    </button>
                    <button
                        type="button"
                        onClick={handleDecimal}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-base font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        .
                    </button>

                    {/* Row 5: 0 | = | empty | empty */}
                    <button
                        type="button"
                        onClick={() => handleDigit("0")}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-sm font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        0
                    </button>
                    <button
                        type="button"
                        onClick={handleEquals}
                        className="h-10 bg-white hover:bg-neutral-100 active:bg-neutral-200 border border-[#D1D5DB] rounded-md text-base font-semibold text-neutral-800 transition-colors cursor-pointer flex items-center justify-center"
                    >
                        =
                    </button>
                    <div className="h-10 bg-transparent" />
                    <div className="h-10 bg-transparent" />
                </div>
            </div>
        </div>
    );
}
