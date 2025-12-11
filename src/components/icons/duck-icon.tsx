import type { SVGProps } from 'react';

export function DuckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
    >
      <g>
        {/* Body */}
        <path d="M25,60 C10,60 10,85 25,85 L75,85 C90,85 90,60 75,60 L60,60" fill="#FFD700" />
        {/* Head */}
        <circle cx="65" cy="45" r="20" fill="#FFD700" />
        {/* Beak */}
        <path d="M85,45 C95,40 95,50 85,45" fill="#FFA500" />
        {/* Eye */}
        <circle cx="70" cy="40" r="2" fill="#000000" />
        {/* Wing */}
        <path d="M40,70 C45,65 45,75 40,70 C45,65 45,75 40,70" stroke="#FFA500" fill="none" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
