type IconProps = { className?: string };

export const ArrowIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
