interface HandBagProps {
  size?: number;
  color?: string;
}

function HandBag({ size = 20, color = '#7E7E7E' }: HandBagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-handbag-icon lucide-handbag"
    >
      <path d="M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z" />
      <path d="M8 11V6a4 4 0 0 1 8 0v5" />
    </svg>
  );
}

export default HandBag;
