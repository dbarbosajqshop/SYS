import React from "react";
import { Caption } from "./typography/Caption";

type Props = {
  children?: React.ReactNode;
  align?: "left" | "center" | "right";
};

export const Th = ({ children, align = "left" }: Props) => {
  return (
    <th align={align} className="text-left px-3 text-nowrap">
      <Caption variant="large-semibold" color="text-neutral-500">
        {children}
      </Caption>
    </th>
  );
};
