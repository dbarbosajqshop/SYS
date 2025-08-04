import { Button } from "@/ui/Button";
import { Heading } from "@/ui/typography/Heading";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  setOrderLocal: (value: "online" | "presencial") => void;
};

export const OrderLocalModal = ({ open, setOpen, setOrderLocal }: Props) => {
  const handleSelectLocal = (local: "online" | "presencial") => {
    setOrderLocal(local);
    setOpen(false);
  };
  return (
    <div
      className={`fixed p-10 left-0 top-0 z-50 flex h-screen w-screen items-center justify-center
          bg-black bg-opacity-80 ${open ? "" : "hidden"} `}
    >
      <div>
        <Heading color="text-brand-600">Selecione o estoque</Heading>
        <div className="flex gap-4 mt-4 items-center justify-center">
          <Button onClick={() => handleSelectLocal("online")}>Online</Button>
          <Button onClick={() => handleSelectLocal("presencial")}>Presencial</Button>
        </div>
      </div>
    </div>
  );
};
