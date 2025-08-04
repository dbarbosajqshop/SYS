import { Color } from "@/types/colors";
import React from "react";

type Props = {
  children: React.ReactNode;
  variant?:
    | "large"
    | "large-semibold"
    | "medium"
    | "medium-semibold"
    | "small"
    | "small-semibold";
  color?: Color;
  onClick?: () => void;
  className?: string;
};

export const Link = ({
  children,
  color = "text-neutral-950",
  variant = "medium",
  onClick,
  className,
}: Props) => {
  const linkStyles = {
    large: "text-base font-medium",
    "large-semibold": "text-base font-semibold",
    medium: "text-sm font-medium",
    "medium-semibold": "text-sm font-semibold",
    small: "text-xs font-medium",
    "small-semibold": "text-xs font-semibold",
  };
  return (
    <p
      className={`${linkStyles[variant]} leading-lg tracking-default underline cursor-pointer ${color} ${className}`}
      onClick={onClick || undefined}
    >
      {children}
    </p>
  );
};
