import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const Tr = ({ children, className }: Props) => {
  return (
    <tr className={`h-[52px] border border-neutral-200 text-nowrap ${className}`}>
      {children}
    </tr>
  );
};
