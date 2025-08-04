type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export const Inventory = ({ color = "#A3A3A3", width = 24, height = 24 }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_144_47)">
        <path
          d="M20 2H4C3 2 2 2.9 2 4V7.01C2 7.73 2.43 8.35 3 8.7V20C3 21.1 4.1 22 5 22H19C19.9 22 21 21.1 21 20V8.7C21.57 8.35 22 7.73 22 7.01V4C22 2.9 21 2 20 2ZM15 14H9V12H15V14ZM20 7H4V4L20 3.98V7Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_144_47">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
