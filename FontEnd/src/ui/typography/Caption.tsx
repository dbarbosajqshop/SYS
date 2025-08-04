import { Color } from "@/types/colors";
import React from "react";

type Props = {
  children: React.ReactNode;
  variant?: "large" | "large-semibold" | "small" | "small-semibold";
  color?: Color;
  className?: string;
  onClick?: () => void;
  title?: string;
};

export const Caption = ({
  children,
  color = "text-neutral-950",
  variant = "large",
  className,
  onClick,
  title,
}: Props) => {
  const captionStyles = {
    large: "text-sm font-medium",
    "large-semibold": "text-sm font-semibold",
    small: "text-xs font-medium",
    "small-semibold": "text-xs font-semibold",
  };
  return (
    <p
      onClick={onClick}
      {...(title ? { title } : {})}
      className={`${captionStyles[variant]} leading-lg tracking-default ${color} ${className}`}
    >
      {children}
    </p>
  );
};
