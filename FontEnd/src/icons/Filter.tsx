type Props = {
  color?: string;
  width?: number;
  height?: number;
};

export const Filter = ({ color = "#262626", width = 24, height = 24 }: Props) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2187_2879)">
        <path
          d="M3.54165 4.71667C3.62498 4.825 8.32498 10.825 8.32498 10.825V15.8333C8.32498 16.2917 8.69998 16.6667 9.16665 16.6667H10.8416C11.3 16.6667 11.6833 16.2917 11.6833 15.8333V10.8167C11.6833 10.8167 16.2583 4.96667 16.475 4.7C16.6916 4.43334 16.6666 4.16667 16.6666 4.16667C16.6666 3.70834 16.2916 3.33334 15.825 3.33334H4.17498C3.66665 3.33334 3.33331 3.73334 3.33331 4.16667C3.33331 4.33334 3.38331 4.53334 3.54165 4.71667Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_2187_2879">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
