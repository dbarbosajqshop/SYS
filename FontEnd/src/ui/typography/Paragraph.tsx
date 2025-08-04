import { Color } from "@/types/colors";
import React from "react";

type Props = {
  children: React.ReactNode;
  variant?: "large" | "large-semibold";
  color?: Color;
  className?: string;
  onClick?: () => void;
};

export const Paragraph = ({
  children,
  variant = "large",
  color = "text-neutral-950",
  className,
  onClick,
}: Props) => {
  const paragraphStyles = {
    large: "tracking-default font-medium",
    "large-semibold": "tracking-medium font-semibold",
  };

  return (
    <p
      onClick={onClick}
      className={`${paragraphStyles[variant]} text-base leading-lg ${color} ${className}`}
    >
      {children}
    </p>
  );
};
