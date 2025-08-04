type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export const Layers = ({ color = "#323232", width = 24, height = 24 }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_33_4075)">
        <path
          d="M11.99 18.54L4.62 12.81L3 14.07L12 21.07L21 14.07L19.37 12.8L11.99 18.54ZM12 16L19.36 10.27L21 9L12 2L3 9L4.63 10.27L12 16Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_33_4075">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
