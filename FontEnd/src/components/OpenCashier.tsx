import { handleAmountChange } from "@/helpers";
import { Monetization } from "@/icons/Monetization";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Heading } from "@/ui/typography/Heading";
import { useState } from "react";

type Props = {
  open: (amount: number) => void;
};

export const OpenCashier = ({open}: Props) => {
  const [amount, setAmount] = useState("");

  const handleOpenCashier = () => {
    const value = parseFloat(amount.replace(",", "."));

    if (value <= 0) {
      return;
    }

    open(value);
  };

  return (
    <div className="flex flex-col items-center pt-8">
      <div>
        <Heading variant="medium">Abrir caixa</Heading>
        <Input
          wide
          label="Valor inicial"
          placeholder="Digite o valor inicial do caixa"
          iconPosition="left"
          icon={<Monetization color="green" />}
          data={amount}
          onChange={(e) => handleAmountChange(e, setAmount)}
        />
        <Button onClick={handleOpenCashier} wide>
          Confirmar
        </Button>
      </div>
    </div>
  );
};
