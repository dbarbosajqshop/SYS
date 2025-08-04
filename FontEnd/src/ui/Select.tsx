import React, { SelectHTMLAttributes } from "react"; 
import { Paragraph } from "./typography/Paragraph";
import { X } from "lucide-react";

export type Option = {
  label: string;
  value: string;
};

type Props = SelectHTMLAttributes<HTMLSelectElement> & { 
  data: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  options: Option[];
  wide?: boolean;
  className?: string;
  name?: string; 
  clearable?: boolean;
  placeholder?: string;
};

export const Select = ({
  data,
  onChange,
  label,
  options,
  wide = false,
  className = "bg-neutral-100",
  name,
  clearable,
  placeholder,
  disabled, 
  ...rest 
}: Props) => {
  return (
    <div className="my-4">
      {label && <Paragraph variant="large-semibold">{label}</Paragraph>}
      <div className={`flex relative items-center ${label && "mt-2"}`}>
        {clearable && data && (
          <X
            className="absolute right-4  cursor-pointer"
            onClick={() =>
              onChange({
                target: { value: "" },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          />
        )}
        <select
          className={`h-12 ${
            wide && "w-full"
          } pl-4 border border-neutral-200 hover:ring-2 hover:ring-neutral-400 active:border-neutral-950 rounded-quack ${className}`}
          value={data}
          onChange={onChange}
          name={name}
          disabled={disabled} 
          {...rest} 
        >
          <option value="" defaultChecked hidden>
            {placeholder || "Selecione uma opção"}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};