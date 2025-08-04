type Props = {
  width?: number;
  height?: number;
  className?: string;
};

export const TrashDelete = ({ height = 56, width = 56, className }: Props) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.5 28C0.5 12.8122 12.8122 0.5 28 0.5C43.1878 0.5 55.5 12.8122 55.5 28C55.5 43.1878 43.1878 55.5 28 55.5C12.8122 55.5 0.5 43.1878 0.5 28Z"
        fill="#FEE2E2"
      />
      <path
        d="M0.5 28C0.5 12.8122 12.8122 0.5 28 0.5C43.1878 0.5 55.5 12.8122 55.5 28C55.5 43.1878 43.1878 55.5 28 55.5C12.8122 55.5 0.5 43.1878 0.5 28Z"
        stroke="#DC2626"
      />
      <g clipPath="url(#clip0_2172_1922)">
        <path
          d="M22 35.5C22 36.6 22.9 37.5 24 37.5H32C33.1 37.5 34 36.6 34 35.5V23.5H22V35.5ZM35 20.5H31.5L30.5 19.5H25.5L24.5 20.5H21V22.5H35V20.5Z"
          fill="#DC2626"
        />
      </g>
      <defs>
        <clipPath id="clip0_2172_1922">
          <rect width="24" height="24" fill="white" transform="translate(16 16.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};
