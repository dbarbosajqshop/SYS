import { useState } from "react";
import { Close } from "@/icons/Close";
import { CreditCard } from "@/icons/CreditCard";
import { Monetization } from "@/icons/Monetization";
import { Pix } from "@/icons/Pix";
import { Button } from "@/ui/Button";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Subtitle } from "@/ui/typography/Subtitle";
import { AccountBalance } from "@/icons/AccountBalance";
import { Caption } from "@/ui/typography/Caption";
import { Input } from "@/ui/Input";
import { formatMoney, handleAmountChange } from "@/helpers";
import { Payment } from "@/types/carts";
import { IconButton } from "@/ui/IconButton";
import { Delete } from "@/icons/Delete";

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  total: number;
  setPayments: (payments: Payment[]) => void;
  paymentOrder: number;
  setPaymentOrder: (paymentOrder: number) => void;
};

export type PaymentOption = {
  type: string;
  installment: number;
  amount: string;
};

export const PaymentModal = ({
  open,
  setOpen,
  total,
  setPayments,
  paymentOrder,
  setPaymentOrder,
}: ModalProps) => {
  const [payment, setPayment] = useState("");
  const [step, setStep] = useState(0);
  const [installments, setInstallments] = useState(1);
  const [amount, setAmount] = useState("");
  const [paymentOptions, setPaymentsOptions] = useState<PaymentOption[]>([]);

  const handleSubmit = () => {
    const newPayments = paymentOptions.map((payment) => ({
      type: payment.type,
      installment: payment.installment,
      amount: Number(payment.amount),
    }));
    setPayments(newPayments);
    setOpen(false);
    setStep(0);
  };

  const handleAdvance = () => {
    switch (step) {
      case 0:
        handleSubmit();
        break;
      case 1:
        setStep(2);
        break;
      default:
        handleSubmit();
    }
  };

  const handleCancel = () => {
    if (step === 0) {
      setPayment("");
      setPaymentsOptions([]);
      setPayments([]);
      setPaymentOrder(0);
      setOpen(false);
      setInstallments(1);
    }

    return setStep(0);
  };

  const handleButtonText = () => (step === 1 ? "Próximo" : "Adicionar pagamento");

  const handleAddPayment = () => {
    if (step > 2) return;
    const getPayments = paymentOptions;
    const newPayment = {
      type: payment,
      installment: payment === "credito" ? installments : 1,
      amount: amount.replace(",", "."),
    };
    getPayments[paymentOrder] = newPayment;
    setPaymentsOptions(getPayments);
    setPaymentOrder(paymentOrder + 1);
    setPayment("");
    setInstallments(1);
    setAmount("");
    setStep(0);
  };

  const calculateTax = (value: number, installments: number) => {
    switch (installments) {
      case 1:
        return value + value * 0.06;
      case 2:
        return value + value * 0.08;
      case 3:
        return value + value * 0.12;
      default:
        return 0;
    }
  };

  const calculateTotal = () => {
    let total = 0;
    paymentOptions.forEach((payment) => {
      total +=
        payment.type === "credito"
          ? calculateTax(Number(payment.amount), payment.installment)
          : Number(payment.amount);
    });
    return total;
  };

  const calculateTotalWithoutTax = () => {
    let total = 0;
    paymentOptions.forEach((payment) => {
      total += Number(payment.amount);
    });
    return total;
  };

  const showPaymentText = (payment: string) => {
    switch (payment) {
      case "credito":
        return "Crédito";
      case "debito":
        return "Débito";
      case "machinepix":
        return "Pix maquininha";
      case "keypix":
        return "Pix QR Code";
      case "dinheiro":
        return "Dinheiro";
      case "ted":
        return "TED";
      default:
        return "";
    }
  };

  return (
    <div
      className={`${
        open ? "fixed" : "hidden"
      } inset-0 bg-black pt-20 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto`}
    >
      <div className="px-2 w-min sm:w-[640px] bg-neutral-0 rounded-sm border border-neutral-200">
        {step === 0 && (
          <div className="p-sm">
            <div className="flex justify-between h-[77px] border-b border-neutral-200">
              <Subtitle variant="large-semibold">Adicionar pagamento</Subtitle>
              <Close onClick={() => setOpen(false)} />
            </div>
            {paymentOptions.length > 0 &&
              paymentOptions.map((payment) => (
                <div
                  key={payment.type}
                  className="flex items-center justify-between border bg-neutral-100 p-nano rounded-nano mb-2"
                >
                  <Subtitle>{showPaymentText(payment.type)}</Subtitle>
                  {payment.type === "credito" && (
                    <Subtitle>{payment.installment}X</Subtitle>
                  )}
                  <div className="flex gap-4">
                    <Subtitle>{formatMoney(payment.amount)}</Subtitle>
                    {payment.type === "credito" && (
                      <Subtitle>
                        (
                        {formatMoney(
                          calculateTax(Number(payment.amount), payment.installment)
                        )}
                        )
                      </Subtitle>
                    )}
                  </div>
                  <IconButton
                    onClick={() => {
                      const newPayments = paymentOptions.filter(
                        (item) => item !== payment
                      );
                      setPaymentsOptions(newPayments);
                      setPaymentOrder(paymentOrder - 1);
                    }}
                    iconColor="red"
                    variant="filled"
                  >
                    <Delete />
                  </IconButton>
                </div>
              ))}
            <Button
              disabled={paymentOrder > 2}
              variant="outline"
              onClick={() => setStep(1)}
              wide
            >
              Adicionar forma de pagamento
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="p-sm">
            <Subtitle variant="large-semibold">Formas de pagamento</Subtitle>
            <div className="flex flex-wrap gap-5 mt-6">
              <div
                onClick={() => setPayment("credito")}
                className="flex items-center justify-between w-[274px] py-xxs px-4 border border-neutral-200 rounded-nano"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="credito"
                    checked={payment === "credito"}
                    onChange={() => setPayment("credito")}
                  />
                  <Paragraph>Crédito</Paragraph>
                </label>
                <CreditCard color="#71717A" />
              </div>
              <div
                onClick={() => setPayment("debito")}
                className="w-[274px] py-xxs px-4 border border-neutral-200 rounded-nano"
              >
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="Débito"
                      checked={payment === "debito"}
                      onChange={() => setPayment("debito")}
                    />
                    <Paragraph>Débito</Paragraph>
                  </label>
                  <CreditCard color="#71717A" />
                </div>
              </div>
              <div
                onClick={() => setPayment("machinepix")}
                className="flex items-center justify-between w-[274px] py-xxs px-4 border border-neutral-200 rounded-nano"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="machinepix"
                    checked={payment === "machinepix"}
                    onChange={() => setPayment("machinepix")}
                  />
                  <Paragraph>Pix maquininha</Paragraph>
                </label>
                <Pix color="#71717A" />
              </div>
              <div
                onClick={() => setPayment("keypix")}
                className="flex items-center justify-between w-[274px] py-xxs px-4 border border-neutral-200 rounded-nano"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="keypix"
                    checked={payment === "keypix"}
                    onChange={() => setPayment("keypix")}
                  />
                  <Paragraph>Pix QR Code</Paragraph>
                </label>
                <Pix color="#71717A" />
              </div>
              <div
                onClick={() => setPayment("dinheiro")}
                className="flex items-center justify-between w-[274px] py-xxs px-4 border border-neutral-200 rounded-nano"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="dinheiro"
                    checked={payment === "dinheiro"}
                    onChange={() => setPayment("dinheiro")}
                  />
                  <Paragraph>Dinheiro</Paragraph>
                </label>
                <Monetization color="#71717A" />
              </div>
              <div
                onClick={() => setPayment("ted")}
                className="flex items-center justify-between w-[274px] py-xxs px-4 border border-neutral-200 rounded-nano"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="ted"
                    checked={payment === "ted"}
                    onChange={() => setPayment("ted")}
                  />
                  <Paragraph>TED</Paragraph>
                </label>
                <AccountBalance color="#71717A" />
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="p-sm flex flex-col gap-1">
            <Subtitle variant="large-semibold">{payment}</Subtitle>
            {payment === "credito" && (
              <div className="mb-4">
                <div className="flex flex-col flex-wrap gap-5 mt-6">
                  <div
                    onClick={() => setInstallments(1)}
                    className="flex items-center justify-between w-full py-xxs px-4 border border-neutral-200 rounded-nano"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="installments"
                        value={1}
                        checked={installments === 1}
                        onChange={() => setInstallments(1)}
                      />
                      <Paragraph>À vista</Paragraph>
                    </label>
                    <Caption>Taxa: 6%</Caption>
                  </div>
                  <div
                    onClick={() => setInstallments(2)}
                    className="flex items-center justify-between w-full py-xxs px-4 border border-neutral-200 rounded-nano"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="installments"
                        value={2}
                        checked={installments === 2}
                        onChange={() => setInstallments(2)}
                      />
                      <Paragraph>2 vezes</Paragraph>
                    </label>
                    <Caption>Taxa: 8%</Caption>
                  </div>
                  <div
                    onClick={() => setInstallments(3)}
                    className="flex items-center justify-between w-full py-xxs px-4 border border-neutral-200 rounded-nano"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="installments"
                        value={2}
                        checked={installments === 3}
                        onChange={() => setInstallments(3)}
                      />
                      <Paragraph>3 vezes</Paragraph>
                    </label>
                    <Caption>Taxa: 12%</Caption>
                  </div>
                </div>
              </div>
            )}

            <Subtitle>Insira o valor pago pelo cliente</Subtitle>
            <Input
              wide
              iconPosition="left"
              icon={<Monetization color="green" />}
              data={amount}
              onChange={(e) => handleAmountChange(e, setAmount)}
            />
            <Button
              disabled={amount === ""}
              onClick={handleAddPayment}
              variant="outline"
              wide
            >
              Salvar
            </Button>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <Subtitle
            color={
              Number((total - calculateTotalWithoutTax()).toFixed(2)) <= 0
                ? "text-success-600"
                : "text-error-600"
            }
            className="p-sm"
          >
            Saldo: {formatMoney((total - calculateTotalWithoutTax()) * -1)}
          </Subtitle>
          <Subtitle color="text-success-600" className="p-sm">
            Total: {formatMoney(calculateTotal())}
          </Subtitle>
        </div>

        <div className="flex justify-end gap-2 px-sm py-xxs border-t">
          <Button variant="naked" color="default" onClick={handleCancel}>
            {step === 0 ? "Cancelar" : "Voltar"}
          </Button>
          {(step === 0 || step === 1) && (
            <Button
              // disabled={payments.length === 0}
              onClick={handleAdvance}
              variant="primary"
            >
              {handleButtonText()}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
