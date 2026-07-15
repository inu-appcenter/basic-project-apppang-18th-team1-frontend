interface UpArrowProps {
  size?: number;
  color?: string;
}

function UpArrow({ size = 20, color = '#7E7E7E' }: UpArrowProps) {
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
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default UpArrow;
