type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export const Logout = ({ color = "#A3A3A3", width = 24, height = 24 }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_144_93)">
        <path
          d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_144_93">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
