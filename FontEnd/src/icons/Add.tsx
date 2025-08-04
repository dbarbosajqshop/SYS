type Props = {
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
};

export const Add = ({ color = "#323232", width = 24, height = 24, className, onClick }: Props) => {
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
      <g clipPath="url(#clip0_33_775)">
        <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill={color} />
      </g>
      <defs>
        <clipPath id="clip0_33_775">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
