type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export const AccountBalance = ({ color = "#323232", width = 24, height = 24 }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_33_2536)">
        <path d="M7 10H4V17H7V10Z" fill={color} />
        <path d="M13.5 10H10.5V17H13.5V10Z" fill={color} />
        <path d="M22 19H2V22H22V19Z" fill={color} />
        <path d="M20 10H17V17H20V10Z" fill={color} />
        <path d="M12 1L2 6V8H22V6L12 1Z" fill={color} />
      </g>
      <defs>
        <clipPath id="clip0_33_2536">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
