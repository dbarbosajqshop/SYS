type Props = {
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
};

export const KeyboardArrowRight = ({
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
      <g clipPath="url(#clip0_2197_7366)">
        <path
          d="M8.59009 16.59L13.1701 12L8.59009 7.41L10.0001 6L16.0001 12L10.0001 18L8.59009 16.59Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_2197_7366">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
