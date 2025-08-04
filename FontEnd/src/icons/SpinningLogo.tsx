import { useEffect, useState } from "react";

type Props = {
  width?: number;
  height?: number;
};

export const SpinningLogo = ({ height = 56, width = 56 }: Props) => {
  const [colors, setColors] = useState(["#1567E2", "#D9EFFF", "#D9EFFF", "#D9EFFF"]);

  useEffect(() => {
    const interval = setInterval(() => {
      setColors((prevColors) => {
        return [prevColors[3], prevColors[0], prevColors[1], prevColors[2]];
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      className="relative top-1 left-1/2 z-20"
      width={width}
      height={height}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.2801 6.66666C9.17866 6.66666 6.66443 9.17386 6.66443 12.2667V19.4667C6.66443 22.5595 9.17866 25.0667 12.2801 25.0667H25.0689V12.2667C25.0689 9.17386 22.5547 6.66666 19.4532 6.66666H12.2801Z"
        fill={colors[0]}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.2801 49.3333C9.17866 49.3333 6.66443 46.8261 6.66443 43.7333V36.5333C6.66443 33.4406 9.17866 30.9333 12.2801 30.9333H25.0689V43.7333C25.0689 46.8261 22.5547 49.3333 19.4532 49.3333H12.2801Z"
        fill={colors[3]}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M43.7198 6.66666C46.8213 6.66666 49.3355 9.17386 49.3355 12.2667V19.4667C49.3355 22.5595 46.8213 25.0667 43.7198 25.0667H30.931V12.2667C30.931 9.17386 33.4453 6.66666 36.5467 6.66666H43.7198Z"
        fill={colors[1]}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M43.7198 49.3333C46.8213 49.3333 49.3355 46.8261 49.3355 43.7333V36.5333C49.3355 33.4406 46.8213 30.9333 43.7198 30.9333H30.931V43.7333C30.931 46.8261 33.4453 49.3333 36.5467 49.3333H43.7198Z"
        fill={colors[2]}
      />
    </svg>
  );
};
