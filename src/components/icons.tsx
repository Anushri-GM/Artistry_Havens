import type { SVGProps } from "react";

export function ArtistryHavensLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12 2 7.34 4.9a2 2 0 0 0-1.34 1.83v9.54a2 2 0 0 0 1.34 1.83L12 22l4.66-2.9a2 2 0 0 0 1.34-1.83V6.73a2 2 0 0 0-1.34-1.83L12 2z" />
            <path d="m7 5 5 3 5-3" />
            <path d="m7 19 5-3 5 3" />
        </svg>
    );
}
