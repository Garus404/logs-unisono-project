import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
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
      <path d="M4 4v16h16" />
      <path d="M8 4v16" />
      <path d="M4 20c0-4 4-4 4-4s4 0 4 4" />
      <path d="M12 20V4" />
      <path d="M16 4v16" />
      <path d="M20 4v16" />
    </svg>
  );
}
