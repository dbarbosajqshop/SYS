type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export const DeleteOutline = ({ color = "#DC2626", width = 24, height = 24 }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2188_3492)">
        <path
          d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_2188_3492">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
