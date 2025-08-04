type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export const Dashboard = ({ color = "#A3A3A3", width = 24, height = 24 }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_144_43)">
        <path
          d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_144_43">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
