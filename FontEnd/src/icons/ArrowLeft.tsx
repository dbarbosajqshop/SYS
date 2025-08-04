type Props = {
  color?: string;
  onClick?: () => void;
};

export const ArrowLeft = ({ color = "#0A0A0A", onClick }: Props) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer"
      onClick={onClick}
    >
      <g clipPath="url(#clip0_45_711)">
        <path
          d="M18.2733 12.94L17.3333 12L13.3333 16L17.3333 20L18.2733 19.06L15.22 16L18.2733 12.94Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_45_711">
          <rect width="16" height="16" fill="white" transform="translate(8 8)" />
        </clipPath>
      </defs>
    </svg>
  );
};
