import { Color } from "@/types/colors";
import React, { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
  variant?: "large" | "large-semibold" | "small" | "small-semibold" | "medium";
  color?: Color;
  className?: string;
};

export const Subtitle = ({
  children,
  variant = "small",
  color = "text-neutral-950",
  className,
  ...rest
}: Props) => {
  const subtitleStyles = {
    large: "text-2xl font-medium tracking-default",
    "large-semibold": "text-2xl font-semibold tracking-medium",
    small: "text-xl font-medium tracking-default",
    "small-semibold": "text-xl font-semibold tracking-medium",
    medium: "text-base font-medium tracking-default",
  };

  const currentVariant = variant || "small";

  return (
    <span
      className={`${subtitleStyles[currentVariant]} leading-sm ${color} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
};