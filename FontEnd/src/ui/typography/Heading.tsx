import React from "react";
import { Color } from "../../types/colors";

type Props = {
  children: React.ReactNode;
  variant?: "xlarge" | "large" | "medium" | "medium-semibold";
  color?: Color;
};

export const Heading = ({
  children,
  variant = "medium",
  color = "text-neutral-950",
}: Props) => {
  const headingStyles = {
    xlarge: "text-[56px] tracking-large font-medium",
    large: "text-5xl tracking-large font-medium",
    medium: "text-[32px] tracking-default font-medium",
    "medium-semibold": "text-[32px] tracking-medium font-semibold",
  };
  return (
    <h1 className={`${headingStyles[variant]} leading-sm ${color}`}>{children}</h1>
  );
};
