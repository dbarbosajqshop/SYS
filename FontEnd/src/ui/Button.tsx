import React, { ReactElement } from "react";

type Props = {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "naked";
  color?: "default" | "destruct";
  disabled?: boolean;
  wide?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: ReactElement<{ color: string; height: number; width: number }>;
  type?: "button" | "submit";
};

export const Button = ({
  children,
  variant = "primary",
  color = "default",
  disabled = false,
  wide = false,
  onClick,
  className,
  icon,
  type = "button",
}: Props) => {
  const buttonStyles = {
    default: {
      primary: `bg-brand-700 border border-brand-700 text-neutral-0 hover:bg-brand-600 active:bg-brand-700 disabled:bg-neutral-200`,
      outline: `bg-neutral-0 border border-brand-700 text-brand-700 hover:bg-brand-700 hover:text-neutral-0 active:bg-brand-800 active:text-neutral-0 disabled:border-neutral-200 disabled:hover:bg-neutral-0`,
      naked: `text-neutral-950 hover:bg-neutral-100 active:bg-neutral-200 disabled:hover:bg-neutral-0`,
    },
    destruct: {
      primary: "bg-error-600 text-neutral-0",
      outline:
        "bg-neutral-0 hover:bg-error-600 hover:text-white transition-all border border-error-600 text-error-600",
      naked: "bg-neutral-0 text-error-600 border-0",
    },
  };

  const IconColor = () => {
    if (disabled) return "#71717A";
    if (variant === "primary") return "#FFF";
    if (variant === "outline") {
      if (color === "default") return "#1567E2";
      if (color === "destruct") return "#DC2626";
    }
    if (color === "default") return "#0A0A0A";
    return "#DC2626";
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`flex justify-center items-center gap-nano px-xxs py-xs text-nowrap rounded-nano font-semibold my-1 ${
        buttonStyles[color][variant]
      } transition-all disabled:text-neutral-500 ${
        wide && "w-full"
      } ${className}`}
      onClick={onClick}
    >
      {React.isValidElement(icon)
        ? React.cloneElement(icon, {
            color: IconColor(),
          })
        : ""}{" "}
      {children}
    </button>
  );
};
