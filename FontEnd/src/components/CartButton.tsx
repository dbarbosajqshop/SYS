import { Paragraph } from "@/ui/typography/Paragraph";
import React, { ReactElement } from "react";

type Props = {
  icon: ReactElement<{ color: string }>;
  text?: string;
  color: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export const CartButton = ({
  icon,
  text,
  color,
  onClick,
  className,
  disabled = false,
}: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ backgroundColor: color }}
      className={`flex items-center justify-center disabled:cursor-not-allowed gap-nano h-10 py-xs px-xxs rounded-nano w-full ${className}`}
    >
      {React.isValidElement(icon)
        ? React.cloneElement(icon, {
            color: "#FFF",
          })
        : ""}
      {text && (
        <Paragraph variant="large-semibold" color="text-neutral-0">
          {text}
        </Paragraph>
      )}
    </button>
  );
};
