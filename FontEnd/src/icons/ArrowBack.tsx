type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export const ArrowBack = ({ color = "#71717A", width = 24, height = 24 }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2188_3450)">
        <path
          d="M16.6666 9.16668H6.52492L11.1833 4.50834L9.99992 3.33334L3.33325 10L9.99992 16.6667L11.1749 15.4917L6.52492 10.8333H16.6666V9.16668Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_2188_3450">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
