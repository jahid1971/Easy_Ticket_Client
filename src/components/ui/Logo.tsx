"use client";

import Link from "next/link";

export function Logo({
    className,
    size = 20,
    variant = "full",
}: {
    className?: string;
    size?: number; // height in px for icon
    variant?: "full" | "icon";
}) {
    const fill = "var(--primary, #0eac53)";
    const fg = "var(--primary-foreground, #fff)";
    return (
        <Link href="/" className={className} aria-label="EasyTicket home">
            {variant === "icon" ? (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-hidden={false}
                >
                    <rect width="32" height="32" rx="6" fill={fill} />
                    <path d="M8 10h9v2H8v6H6v-8a2 2 0 0 1 2-2z" fill={fg} opacity="0.98" />
                    <path d="M16 14h6v2h-4v4h-2v-6z" fill={fg} opacity="0.98" />
                </svg>
            ) : (
                <div className="flex items-center gap-3">
                    <svg
                        width={size}
                        height={size}
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-hidden={false}
                    >
                        <rect width="32" height="32" rx="6" fill={fill} />
                        <circle cx="10" cy="10" r="2" fill={fg} opacity="0.95" />
                        <circle cx="22" cy="22" r="2" fill={fg} opacity="0.95" />
                        <path d="M8 12h9v2H8v6H6v-8a2 2 0 0 1 2-2z" fill={fg} opacity="0.98" />
                    </svg>

                    <span
                        style={{
                            color: "var(--primary, #0eac53)",
                            fontFamily: "var(--font-sans, Inter, system-ui, -apple-system)",
                            fontWeight: 700,
                            letterSpacing: "-0.01em",
                            fontSize: 16,
                            lineHeight: 1,
                        }}
                    >
                        EasyTicket
                    </span>
                </div>
            )}
        </Link>
    );
}
