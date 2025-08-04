type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export const Check = ({ color = "#0A0A0A", width = 24, height = 24 }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4003_159)">
        <path
          d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_4003_159">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
