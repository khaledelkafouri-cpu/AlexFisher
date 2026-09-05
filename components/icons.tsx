export function Surfboard({ size = 16, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2C9 2 7 6 7 12s2 10 5 10 5-4 5-10-2-10-5-10z" />
      <path d="M12 5v14" />
    </svg>
  );
}
