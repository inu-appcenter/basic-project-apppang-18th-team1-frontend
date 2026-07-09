interface RightArrowProps {
  size?: number;
  color?: string;
}

function RightArrow({ size = 20, color = '#7E7E7E' }: RightArrowProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 3L7.5 6l-3 3" />
    </svg>
  );
}

export default RightArrow;
