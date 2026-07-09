interface PhoneProps {
  size?: number;
  color?: string;
}

function Phone({ size = 20, color = '#7E7E7E' }: PhoneProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <circle cx="12" cy="17" r="1" />
    </svg>
  );
}

export default Phone;
