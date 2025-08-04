import React from "react";

type Props = {
  children: React.ReactNode;
};

export const Thead = ({ children }: Props) => {
  return (
    <thead className="bg-neutral-50 border border-neutral-200 h-11 px-sm">
      <tr>{children}</tr>
    </thead>
  );
};
