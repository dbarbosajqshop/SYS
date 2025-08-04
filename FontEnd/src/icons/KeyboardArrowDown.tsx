type Props = {
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
};

export const KeyboardArrowDown = ({
  color = "#0A0A0A",
  width = 24,
  height = 24,
  className,
  onClick,
}: Props) => {
  return (
    <svg
      onClick={onClick}
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2197_7328)">
        <path
          d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_2197_7328">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
