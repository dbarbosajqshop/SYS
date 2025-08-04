import React from "react";
import { Caption } from "./typography/Caption";

type Props = {
  children?: React.ReactNode;
  align?: "left" | "center" | "right";
};

export const Tdfoot = ({ children, align = "left" }: Props) => {
  return (
    <td align={align} className="px-3">
      <Caption variant="large-semibold">{children}</Caption>
    </td>
  );
};
