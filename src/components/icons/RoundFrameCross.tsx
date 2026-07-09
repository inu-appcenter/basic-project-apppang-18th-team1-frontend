interface RoundFrameCrossProps {
  size?: number;
  color?: string;
}

function RoundFrameCross({ size = 20, color = '#7E7E7E' }: RoundFrameCrossProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M2 2l6 6M8 2L2 8" />
    </svg>
  );
}

export default RoundFrameCross;
