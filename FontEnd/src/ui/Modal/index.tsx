import { Close } from "@/icons/Close";
import { Subtitle } from "../typography/Subtitle";
import { Button } from "../Button";
import { useEffect } from "react";

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  entity?: string;
  children: React.ReactNode;
  width?: string; 
  height?: string; 
  showCloseButton?: boolean; 
}

export function ViewModal({
  isOpen,
  onClose,
  title,
  entity,
  children,
  width = "620px", 
  height = "auto", 
  showCloseButton = true,
}: ViewModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed p-10 left-0 top-0 z-50 flex h-screen w-screen items-center justify-center
      bg-black bg-opacity-50 ${isOpen ? "" : "hidden"}`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-[${width}] h-[${height}] overflow-y-auto max-h-full pb-3 bg-neutral-0 rounded-sm border border-neutral-200`}
        style={{ width, height }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between h-[77px] p-sm border-b border-neutral-200">
          <Subtitle variant="large-semibold">
            {title}
            {entity && ` ${entity}`}
          </Subtitle>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <Close />
            </button>
          )}
        </div>
        <div className="p-sm">{children}</div>
        <div className="flex justify-end gap-2 px-sm py-3">
          <Button
            variant="naked"
            color="destruct"
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}