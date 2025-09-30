import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#00D1FF', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#00BFFF', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#A8EDFF', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z" fill="transparent"/>
      <path d="M121.78,103.22L97,78.44c-3.14-3.14-8.22-3.14-11.36,0l-4.78,4.78c-6.6,6.6-17.3,6.6-23.9,0L39,65.32 c-6.6-6.6-6.6-17.3,0-23.9L43.78,36.64c3.14-3.14,3.14-8.22,0-11.36L18.22,6.22C15.08,3.08,9.92,3.08,6.78,6.22l-1.4,1.4 C-2.4,15.4-2.4,28.6,6.22,37.22l23.9,23.9c6.6,6.6,17.3,6.6,23.9,0l4.78-4.78c3.14-3.14,8.22-3.14,11.36,0L95,80.56 c6.6,6.6,17.3,6.6,23.9,0l1.4-1.4C128.08,71.38,128.08,60.62,121.22,53.78l-2.82-2.82c-3.14-3.14-3.14-8.22,0-11.36l1.4-1.4 c3.14-3.14,8.22-3.14,11.36,0l-16.96,16.96c-3.14,3.14-3.14,8.22,0,11.36l2.82,2.82c6.86,6.86,6.86,17.62,0,24.48l-1.4,1.4 c-3.14,3.14-3.14,8.22,0,11.36l1.4,1.4C113.56,106.36,118.64,106.36,121.78,103.22z" fill="url(#grad1)" transform="translate(-2, 2)"/>
      <circle cx="64" cy="64" r="10" fill="url(#grad2)"/>
      <circle cx="64" cy="64" r="16" stroke="url(#grad1)" strokeWidth="1.5" fill="none" strokeOpacity="0.8"/>
      <circle cx="64" cy="64" r="22" stroke="url(#grad1)" strokeWidth="1" fill="none" strokeOpacity="0.6"/>
    </svg>
  );
}