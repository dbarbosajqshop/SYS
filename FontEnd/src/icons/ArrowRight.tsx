type Props = {
  color?: string;
  onClick?: () => void;
  className?: string;
};

export const ArrowRight = ({ color = "#0A0A0A", onClick, className }: Props) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`cursor-pointer ${className}`}
      onClick={onClick}
    >
      <g clipPath="url(#clip0_45_535)">
        <path
          d="M14.6667 12.5L13.7267 13.44L16.78 16.5L13.7267 19.56L14.6667 20.5L18.6667 16.5L14.6667 12.5Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_45_535">
          <rect width="16" height="16" fill="white" transform="translate(8 8.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};
