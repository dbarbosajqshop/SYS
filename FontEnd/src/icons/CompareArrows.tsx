type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export const CompareArrows = ({ color = "#0A0A0A", width = 24, height = 24 }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4259_1560)">
        <path
          d="M9.01 14H2V16H9.01V19L13 15L9.01 11V14ZM14.99 13V10H22V8H14.99V5L11 9L14.99 13Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_4259_1560">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
