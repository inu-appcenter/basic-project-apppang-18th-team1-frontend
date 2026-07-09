interface LeftArrowProps {
  size?: number;
  color?: string;
}

function LeftArrow({ size = 20, color = '#7E7E7E' }: LeftArrowProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default LeftArrow;
