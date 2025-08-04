import React, { ReactElement } from "react";

type Props = {
  children: ReactElement<{ color: string; height: number; width: number }>;
  variant?: "standard" | "filled";
  size?: "small" | "large" | "medium";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  iconColor?: string;
  title?: string;
};

export const IconButton = ({
  children,
  disabled = false,
  onClick,
  size = "small",
  variant = "standard",
  iconColor = "black",
  title,
}: Props) => {
  const buttonSize = {
    small: "w-8 h-8",
    medium: "w-12 h-12 min-w-12 min-h-12",
    large: "min-w-16 w-16 h-16 min-h-16",
  };

  const buttonVariant = {
    standard: "bg-neutral-0 disabled:bg-neutral-0",
    filled:
      "bg-neutral-100 hover:border hover:border-neutral-300 disabled:bg-neutral-100 disabled:border-0",
  };

  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center p-nano rounded-circular ${buttonSize[size]} ${buttonVariant[variant]} hover:bg-neutral-100 active:bg-neutral-200 transition-all duration-150`}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            color: disabled ? "gray" : iconColor,
            width: size === "small" ? 16 : 24,
            height: size === "small" ? 16 : 24,
          })
        : "!"}
    </button>
  );
};
