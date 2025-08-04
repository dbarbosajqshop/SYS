import { ArrowBack } from "@/icons/ArrowBack";
import { Caption } from "@/ui/typography/Caption";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useOrders } from "@/hooks/useOrders";
import { formatMoney, handleAmountChange } from "@/helpers";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useProfile } from "@/hooks/useProfile";
import { redirectWarning } from "@/helpers/messagesWarnings";
import { Input } from "@/ui/Input";
import { Monetization } from "@/icons/Monetization";
import { Button } from "@/ui/Button";
import { AccountBalance } from "@/icons/AccountBalance";
import { Pix } from "@/icons/Pix";
import { CreditCard } from "lucide-react";
import { IconButton } from "@/ui/IconButton";
import { Delete } from "@/icons/Delete";
import { IGetOrder } from "@/types/orders";
import useLoadingStore from "@/store/loadingStore";
import { checkOrderPayments, putReceiptPayments } from "@/services/orders";
import { toast } from "react-toastify";
import { LuImageOff, LuImageUp } from "react-icons/lu";
import { Upload } from "antd";
import { uploadImage } from "@/services/imageUpload";
import { Row } from "@/components/row";

type PaymentOption = {
  type: string;
  installment: number;
  amount: string;
  proofOfPaymentImageUrl?: string;
};

export default function PaymentDetail() {
  const navigate = useNavigate();

  const { setIsLoading } = useLoadingStore();

  const { id = "" } = useParams();

  const [orderData, setOrderData] = useState<IGetOrder | undefined>();

  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState("");
  const [step, setStep] = useState(0);
  const [installments, setInstallments] = useState(1);
  const [amount, setAmount] = useState("");
  const [paymentOptions, setPaymentsOptions] = useState<PaymentOption[]>([]);
  const [paymentOrder, setPaymentOrder] = useState(0);

  const uploadAttachment = async (file: File, index: number) => {
    setIsLoading(true);
    const proofOfPaymentImageUrl = await uploadImage("order-receipts", id, file);

    const newPayments = paymentOptions.map((payment, i) => {
      if (i === index) {
        return {
          ...payment,
          proofOfPaymentImageUrl,
        };
      }
      return payment;
    });
    setPaymentsOptions(newPayments);
    setIsLoading(false);
  };

  const handleRemoveAttachment = (index: number) => {
    const newPayments = paymentOptions.map((payment, i) => {
      if (i === index) {
        return {
          ...payment,
          proofOfPaymentImageUrl: undefined,
        };
      }
      return payment;
    });
    setPaymentsOptions(newPayments);
  };

  const handleSavePayments = async () => {
    const newPayments = paymentOptions.map((payment) => ({
      ...payment,
      proofOfPaymentImageUrl: payment.proofOfPaymentImageUrl,
      amount: Number(payment.amount),
    }));

    setIsLoading(true);
    const response = await putReceiptPayments(id, newPayments);
    if (response.status === 404 || response.status === 400) {
      toast.error(response?.data?.message as string);
    }
    console.log(response);
    setIsLoading(false);
  };

  const handleSubmit = () => {
    handleSavePayments();
    setStep(0);
  };

  const handleSendToSeparation = async () => {
    setIsLoading(true);
    const response = await checkOrderPayments(id);

    if (!response.data._id) {
      toast.error(response.data.message);
    }

    navigate("/dashboard/in-payment");
    toast.success("Pedido Pago com sucesso! Enviando para Separacão. ");

    setIsLoading(false);
  };

  const handleAdvance = () => {
    switch (step) {
      case 0:
        handleSubmit();
        break;
      case 1:
        if (!payment.length) break;
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
      setPaymentOrder(0);
      setInstallments(1);
    }

    return setStep(0);
  };

  const handleButtonText = () => (step === 1 ? "Próximo" : "Salvar Pagamentos");
  console.log(step);
  const handleAddPayment = () => {
    if (step > 2) return;

    const getPayments = paymentOptions;
    const newPayment = {
      type: payment,
      installment: payment === "credito" ? installments : 1,
      amount: amount.replace(",", "."),
    };
    getPayments.push(newPayment);
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
    paymentOptions?.forEach((payment) => {
      total +=
        payment.type === "credito"
          ? calculateTax(Number(payment.amount), payment.installment)
          : Number(payment.amount);
    });
    return total;
  };

  const calculateTotalWithoutTax = () => {
    let total = 0;
    paymentOptions?.forEach((payment) => {
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

  const location = useLocation();
  const { authorize, permissions } = useProfile();

  useEffect(() => {
    if (
      permissions.length &&
      (!authorize("r_payments_order") || !authorize("w_payments_order"))
    ) {
      navigate("/profile");
      redirectWarning();
    }
  }, [location.pathname]);

  const { fetchOrder, loading } = useOrders("em pagamento");

  const fetchOrderData = async () => {
    const purchase: IGetOrder | undefined = await fetchOrder(id);

    setTotal(purchase?.totalPrice || 0);
    setOrderData(purchase);
    setPaymentsOptions(
      purchase?.ReceiptPayments?.map((payment) => ({
        amount: String(payment.amount),
        type: payment.type,
        installment: 1,
        proofOfPaymentImageUrl: payment?.proofOfPaymentImageUrl,
      })) || []
    );
  };

  useEffect(() => {
    fetchOrderData();
  }, [location.pathname]);

  if (loading) return <SpinningLogo />;

  return (
    <div className="p-sm sm:px-md bg-neutral-100 h-max">
      <div className="flex flex-col gap-6 p-sm border border-neutral-200 bg-neutral-0">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ArrowBack />
          <Caption color="text-neutral-500" variant="large">
            Dashboard / Em pagamento
          </Caption>
        </div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <Row className="justify-between w-full">
            <div className="min-w-[30%]">
              <Paragraph color="text-neutral-500">
                Pedido: {orderData?.orderNumber}
              </Paragraph>
            </div>
            <Button
              className="my-0 sm:py-2 h-14"
              onClick={handleSendToSeparation}
              variant="primary"
            >
              Enviar para Separação
            </Button>
          </Row>
        </div>

        <div className="px-2 w-full  bg-neutral-0 rounded-sm border border-neutral-200">
          {step === 0 && (
            <div className="p-sm">
              <div className="flex justify-between h-[77px] border-b border-neutral-200">
                <Subtitle variant="large-semibold">Adicionar pagamento</Subtitle>
              </div>
              {paymentOptions?.length > 0 &&
                paymentOptions?.map((payment, index) => (
                  <div
                    key={index}
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
                    <Row>
                      {payment.proofOfPaymentImageUrl ? (
                        <IconButton
                          size="medium"
                          iconColor="green"
                          title="Remover comprovante"
                          onClick={() => {
                            handleRemoveAttachment(index);
                          }}
                          variant="filled"
                        >
                          <LuImageOff className="size-6" />
                        </IconButton>
                      ) : (
                        <Upload
                          beforeUpload={(file) => uploadAttachment(file, index)}
                          customRequest={() => {}}
                          id="fileInput"
                          accept="image/png, image/jpeg"
                          fileList={[]}
                        >
                          <IconButton
                            title="Anexar Comprovante"
                            size="medium"
                            variant="filled"
                          >
                            <LuImageUp className="size-6" />
                          </IconButton>
                        </Upload>
                      )}
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
                    </Row>
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
                          value={3}
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
            {step !== 0 && (
              <Button variant="naked" color="default" onClick={handleCancel}>
                Voltar
              </Button>
            )}
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
    </div>
  );
}
