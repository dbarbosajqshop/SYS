import React from "react";
import { Caption } from "./typography/Caption";

type Props = {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
};

export const Td = ({ children, align = "left", className }: Props) => {
  return (
    <td align={align} className={`px-3 ${className}`}>
      <Caption variant="large">{children}</Caption>
    </td>
  );
};
