import React, { useState, InputHTMLAttributes } from "react"; 
import { Paragraph } from "./typography/Paragraph";

type Props = InputHTMLAttributes<HTMLInputElement> & { 
  data: string | number | readonly string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  placeholder?: string;
  wide?: boolean;
  className?: string;
  name?: string; 
  error?: string;
};

export const Input = ({
  data,
  onChange,
  type = "text",
  label,
  icon,
  placeholder,
  iconPosition = "left",
  wide = false,
  className = "bg-neutral-100",
  name,
  disabled,
  error,
  maxLength = 255,
  ...rest // 
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`my-4 relative ${wide && "w-full"}`}>
      {label && <Paragraph variant="large-semibold">{label}</Paragraph>}
      <div className={`flex items-center ${label && "mt-2"}`}>
        {icon && iconPosition === "left" && (
          <div className="absolute ml-2">{icon}</div>
        )}
        <input
          className={`h-12 ${
            wide && "w-full"
          } disabled:text-neutral-800 placeholder:text-neutral-600 ${
            icon && iconPosition === "left" ? "pl-10" : "pl-2"
          } border ${
            error ? "border-error-600" : "border-neutral-200"
          } hover:ring-2 hover:ring-neutral-400 active:border-neutral-950 rounded-quack ${className}`}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          value={data}
          onChange={onChange}
          name={name}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={type === "password" ? "new-password" : "off"}
          {...rest} 
        />
        {icon && iconPosition === "right" && (
          <div
            onClick={
              type === "password"
                ? () => setShowPassword(!showPassword)
                : undefined
            }
            className={`-ml-8 ${type === "password" && "cursor-pointer"}`}
          >
            {icon}
          </div>
        )}
      </div>
      {error && (
        <Paragraph variant="large" color="text-error-600">
          {error}
        </Paragraph>
      )}
    </div>
  );
};