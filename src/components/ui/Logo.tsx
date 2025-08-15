"use client";



import * as React from "react";

type Variant = "solid" | "outline" | "mono";

export type EasyTicketLogoProps = {
  /** SVG width in px */
  width?: number;
  /** Colorway */
  variant?: Variant;
  /** Extra Tailwind classes */
  className?: string;
  /** Optional title for accessibility */
  title?: string;
};

const colorsByVariant: Record<Variant, { body: string; text: string; wheel: string; rim: string; stroke?: string }>
  = {
    solid:   { body: "#16a34a", text: "#ffffff", wheel: "#000000", rim: "#ffffff" },
    outline: { body: "#ffffff", text: "#16a34a", wheel: "#000000", rim: "#16a34a", stroke: "#16a34a" },
    mono:    { body: "#111827", text: "#ffffff", wheel: "#000000", rim: "#ffffff" },
  };

export  function Logo({ width = 320, variant = "solid", className, title }: EasyTicketLogoProps) {
  const h = (width / 16) * 5; // aspect ~16:5
  const c = colorsByVariant[variant];

  return (
    <svg
      role="img"
      aria-label={title ?? "EasyTicket logo"}
      width={width}
      height={h}
      viewBox="0 0 1600 500"
      className={className}
    >
      {title ? <title>{title}</title> : null}

      {/* Bus shadow */}
      <ellipse cx="800" cy="460" rx="520" ry="28" fill="#000" opacity="0.08" />

      {/* Bus body */}
      <g>
        <path
          d="M120 110 h1020 a80 80 0 0 1 80 80 v100 h120 a60 60 0 0 1 60 60 v60 a40 40 0 0 1 -40 40 h-80 a180 180 0 0 1 -170 0 H280 a180 180 0 0 1 -170 0 h-90 a40 40 0 0 1 -40 -40 V170 a60 60 0 0 1 60 -60 z"
          fill={c.body}
          stroke={c.stroke}
          strokeWidth={c.stroke ? 16 : 0}
          strokeLinejoin="round"
        />

        {/* Windows strip */}
        {/* <rect x="180" y="150" width="880" height="120" rx="20" fill="#ffffff" opacity="0.18" /> */}
        {/* Windshield */}
        <path d="M1240 200 h180 a40 40 0 0 1 40 40 v30 h-240 z" fill="#ffffff" opacity="0.18" />

        {/* Headlight */}
        <circle cx="1480" cy="325" r="18" fill="#ffffff" opacity="0.7" />
      </g>

      {/* Wordmark sitting inside the bus body */}
      <g fontFamily="'Inter', ui-sans-serif, system-ui, -apple-system" fontWeight={800} textAnchor="middle">
        <text x="630" y="330" fontSize="160" letterSpacing="6" fill={c.text}>
          Easy Ticket
        </text>
        {/* Subtle emboss for readability on mono/solid */}
        <text x="730" y="330" fontSize="160" letterSpacing="6" fill="#000" opacity="0.02">
          Easy Ticket
        </text>
      </g>

      {/* Wheels */}
      <g>
        {/* Rear wheel */}
        <circle cx="320" cy="410" r="70" fill={c.wheel} />
        <circle cx="320" cy="410" r="38" fill={c.rim} />
        {/* Front wheel */}
        <circle cx="1180" cy="410" r="70" fill={c.wheel} />
        <circle cx="1180" cy="410" r="38" fill={c.rim} />
      </g>

      {/* Cute ticket notch detail on the "T" area */}
      <path d="M880 235 h130 v100 h-130 a22 22 0 0 1 0 -44 a22 22 0 0 0 0 -12 a22 22 0 0 1 0 -44z" fill="#ffffff" opacity="0.2" />
    </svg>
  );
}

// Optional: a small wrapper to show the logo on different backgrounds
export function EasyTicketLogoPreview() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="bg-white p-6 rounded-2xl shadow">
        <Logo width={360} variant="solid" />
      </div>
      <div className="bg-green-600 p-6 rounded-2xl shadow">
        <Logo width={360} variant="outline" />
      </div>
      <div className="bg-gray-900 p-6 rounded-2xl shadow">
        <Logo width={360} variant="solid" className="drop-shadow" />
      </div>
    </div>
  );
}
