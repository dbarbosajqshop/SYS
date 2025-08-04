import React, { useState, useRef, useEffect } from "react";

type Props = {
  onValueChange: (value: string) => void;
};

export const SquareInput = ({ onValueChange }: Props) => {
  const [value, setValue] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update the parent component with the concatenated value
  useEffect(() => {
    onValueChange(value.join(""));
  }, [value, onValueChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    const updatedValue = [...value];
    updatedValue[index] = newValue;

    setValue(updatedValue);

    // Move to the next input if there is a value and it's not the last box
    if (newValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace key to move focus to the previous input
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text");
    if (pasteData) {
      const pastedValues = pasteData.split("").slice(0, 6); // Limit to 6 characters
      const updatedValue = [...value];

      pastedValues.forEach((char, idx) => {
        updatedValue[idx] = char;
      });

      setValue(updatedValue);

      // Automatically focus the last filled input
      const lastFilledIndex = pastedValues.length - 1;
      if (lastFilledIndex < 5) {
        inputRefs.current[lastFilledIndex + 1]?.focus();
      }
    }

    // Prevent the default paste behavior
    e.preventDefault();
  };

  return (
    <div className="flex gap-2">
      {value.map((val, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          value={val}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          type="text"
          maxLength={1}
          className="w-12 h-12 sm:w-[60px] sm:h-[60px] text-center text-2xl font-semibold text-neutral-900 border-2 border-neutral-400"
        />
      ))}
    </div>
  );
};
