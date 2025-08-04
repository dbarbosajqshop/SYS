import { formatMoney } from "@/helpers";
import { Close } from "@/icons/Close";
import { LocalShipping } from "@/icons/LocalShipping";
import { IPostShipment } from "@/types/client";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Link } from "@/ui/typography/Link";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState } from "react"; 
import * as Yup from "yup";
import { getClient } from "@/services/clients"; 
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  shipmentData: IPostShipment;
  setShipmentData: (
    clientData:
      | Props["shipmentData"]
      | ((prevData: Props["shipmentData"]) => Props["shipmentData"])
  ) => void;
  clientId?: string; 
};

const brazilianStates = [
  "ac",
  "al",
  "ap",
  "am",
  "ba",
  "ce",
  "df",
  "es",
  "go",
  "ma",
  "mt",
  "ms",
  "mg",
  "pa",
  "pb",
  "pr",
  "pe",
  "pi",
  "rj",
  "rn",
  "rs",
  "ro",
  "rr",
  "sc",
  "sp",
  "se",
  "to",
];

const addressValidation = Yup.object().shape({
  street: Yup.string().required("A rua é obrigatória"),
  neighborhood: Yup.string().required("O bairro é obrigatório"),
  state: Yup.string()
    .length(2, "O estado deve ter 2 caracteres")
    .required("O estado é obrigatório")
    .test("state-validation", "Estado inválido", (value) =>
      brazilianStates.includes(value?.toLowerCase() || "")
    ),
  zip: Yup.string().length(8, "O CEP deve ter 8 dígitos").required("O CEP é obrigatório"),
  number: Yup.string().required("O número é obrigatório"),
  complement: Yup.string(),
  city: Yup.string().required("A cidade é obrigatória"),
});

export const ShipmentModal = ({
  open,
  setOpen,
  shipmentData,
  setShipmentData,
  clientId, 
}: Props) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [invalidCep, setInvalidCep] = useState(false);

  const searchClientAddress = async () => {
    if (!clientId) {
      toast.error("Nenhum cliente selecionado. Por favor, selecione um cliente primeiro.");
      return;
    }
    try {
      const response = await getClient(clientId);
      if (response.status === 200 && response.data?.address) {
        const clientAddress = response.data.address;
        setShipmentData((prevData) => ({
          ...prevData,
          address: {
            ...prevData.address,
            street: clientAddress.street || "",
            neighborhood: clientAddress.neighborhood || "",
            city: clientAddress.city || "",
            state: clientAddress.state || "",
            zip: clientAddress.zip || "",
            number: clientAddress.number || "",
            complement: clientAddress.complement || "",
          },
        }));
        setErrors({}); 
        setInvalidCep(false); 
      } else {
        toast.error("Endereço do cliente não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar endereço do cliente:", error);
      toast.error("Erro ao buscar endereço do cliente.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShipmentData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value,
      },
    }));
  };

  const handleAddressValidation = async () => {
    try {
      await addressValidation.validate(shipmentData.address, { abortEarly: false });
      setStep(2);
      setErrors({});
    } catch (validationErrors) {
      const newErrors: { [key: string]: string } = {};
      (validationErrors as Yup.ValidationError).inner.forEach(
        (error: Yup.ValidationError) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        }
      );
      setErrors(newErrors);
    }
  };

  const onClose = () => {
    setOpen(false);
    setStep(1);
  };

  const getError = (field: string) => {
    return errors[field] || "";
  };

  return (
    <div
      className={`${
        open ? "fixed" : "hidden"
      } inset-0 bg-black pt-20 px-6 bg-opacity-50 flex items-center justify-center z-10 overflow-y-auto`}
    >
      <div className="w-auto sm:w-[620px] bg-neutral-0 rounded-sm border border-neutral-200">
        <div className="flex justify-between h-[77px] p-sm border-b border-neutral-200">
          <Subtitle variant="large-semibold">Método de entrega</Subtitle>
          <Close onClick={onClose} />
        </div>
        {step === 1 && (
          <>
            <div className="p-sm">
              <div className="flex items-center justify-between">
                <Subtitle variant="large-semibold">Endereço do cliente</Subtitle>
                {/* Botão para buscar endereço do cliente */}
                <Link onClick={searchClientAddress} variant="large-semibold" color="text-brand-700">
                  Buscar endereço do cliente
                </Link>
              </div>

              <div>
                <Input
                  className="bg-neutral-100 w-full"
                  wide
                  name="zip"
                  data={shipmentData?.address?.zip}
                  label="CEP"
                  onChange={handleInputChange}
                  placeholder="Insira o CEP"
                  error={getError("zip")}
                />
                {invalidCep && (
                  <Paragraph color="text-error-600">
                    CEP inválido. Por favor, insira um CEP válido.
                  </Paragraph>
                )}
                <Input
                  wide
                  name="street"
                  data={shipmentData?.address?.street}
                  label="Rua"
                  placeholder="Insira a rua"
                  onChange={handleInputChange}
                  error={getError("street")}
                />
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                  <Input
                    className="bg-neutral-100 w-full"
                    wide
                    name="neighborhood"
                    data={shipmentData?.address?.neighborhood}
                    label="Bairro"
                    onChange={handleInputChange}
                    placeholder="Insira o bairro"
                    error={getError("neighborhood")}
                  />
                  <Input
                    className="bg-neutral-100 w-full"
                    wide
                    name="number"
                    data={shipmentData?.address?.number?.toString()}
                    label="Número"
                    onChange={handleInputChange}
                    placeholder="Insira o número"
                    error={getError("number")}
                  />
                </div>
                <Input
                  wide
                  name="complement"
                  data={shipmentData?.address?.complement as string}
                  label="Complemento"
                  placeholder="Insira o complemento"
                  onChange={handleInputChange}
                  error={getError("complement")}
                />
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                  <Input
                    wide
                    name="city"
                    data={shipmentData?.address?.city}
                    label="Cidade"
                    placeholder="Insira a cidade"
                    onChange={handleInputChange}
                    error={getError("city")}
                  />
                  <Input
                    className="bg-neutral-100 w-full"
                    wide
                    name="state"
                    data={shipmentData?.address?.state}
                    label="Estado"
                    onChange={handleInputChange}
                    placeholder="Insira o estado"
                    error={getError("state")}
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-sm py-xxs border-t">
              <Button
                variant="naked"
                color="default"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddressValidation} variant="primary">
                Proximo
              </Button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="p-sm">
              <Subtitle variant="large-semibold">Tipo de entrega</Subtitle>

              <div className="flex flex-col gap-4 mt-4">
                <div
                  onClick={() =>
                    setShipmentData((prev) => ({ ...prev, deliveryType: "Retirada" }))
                  }
                  className="flex items-center justify-between w-full py-xxs px-4 border border-neutral-200 rounded-nano"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="Retirada"
                      checked={shipmentData.deliveryType === "Retirada"}
                      onChange={() =>
                        setShipmentData((prev) => ({ ...prev, deliveryType: "Retirada" }))
                      }
                    />
                    <Paragraph>
                      <b>Retirada</b> - Rua Talmud Thorá, Bairro lorem sit - 148
                    </Paragraph>
                  </label>
                </div>
                <div
                  onClick={() =>
                    setShipmentData((prev) => ({ ...prev, deliveryType: "Sedex" }))
                  }
                  className="flex items-center justify-between w-full py-xxs px-4 border border-neutral-200 rounded-nano"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="Sedex"
                      checked={shipmentData.deliveryType === "Sedex"}
                      onChange={() =>
                        setShipmentData((prev) => ({ ...prev, deliveryType: "Sedex" }))
                      }
                    />
                    <Paragraph>
                      <b>Sedex</b> - 5 Dias
                    </Paragraph>
                  </label>
                  <div className="flex items-center gap-2">
                    <Paragraph variant="large-semibold">{formatMoney(50)}</Paragraph>
                    <LocalShipping color="#71717A" />
                  </div>
                </div>
                <div
                  onClick={() =>
                    setShipmentData((prev) => ({ ...prev, deliveryType: "PAC" }))
                  }
                  className="flex items-center justify-between w-full py-xxs px-4 border border-neutral-200 rounded-nano"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="PAC"
                      checked={shipmentData.deliveryType === "PAC"}
                      onChange={() =>
                        setShipmentData((prev) => ({ ...prev, deliveryType: "PAC" }))
                      }
                    />
                    <Paragraph>
                      <b>PAC</b> - 2 Dias
                    </Paragraph>
                  </label>
                  <div className="flex items-center gap-2">
                    <Paragraph variant="large-semibold">{formatMoney(75)}</Paragraph>
                    <LocalShipping color="#71717A" />
                  </div>
                </div>
                <div
                  onClick={() =>
                    setShipmentData((prev) => ({ ...prev, deliveryType: "JadLog" }))
                  }
                  className="flex items-center justify-between w-full py-xxs px-4 border border-neutral-200 rounded-nano"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="JadLog"
                      checked={shipmentData.deliveryType === "JadLog"}
                      onChange={() =>
                        setShipmentData((prev) => ({ ...prev, deliveryType: "JadLog" }))
                      }
                    />
                    <Paragraph>
                      <b>JadLog</b> - 5 Dias
                    </Paragraph>
                  </label>
                  <div className="flex items-center gap-2">
                    <Paragraph variant="large-semibold">{formatMoney(45)}</Paragraph>
                    <LocalShipping color="#71717A" />
                  </div>
                </div>
                <div
                  onClick={() =>
                    setShipmentData((prev) => ({ ...prev, deliveryType: "Ônibus" }))
                  }
                  className="flex items-center justify-between w-full py-xxs px-4 border border-neutral-200 rounded-nano"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="Ônibus"
                      checked={shipmentData.deliveryType === "Ônibus"}
                      onChange={() =>
                        setShipmentData((prev) => ({ ...prev, deliveryType: "Ônibus" }))
                      }
                    />
                    <Paragraph>
                      <b>Ônibus</b> - 2 Horas
                    </Paragraph>
                  </label>
                  <div className="flex items-center gap-2">
                    <Paragraph variant="large-semibold">{formatMoney(50)}</Paragraph>
                    <LocalShipping color="#71717A" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-sm py-xxs border-t">
              <Button
                variant="naked"
                color="default"
                onClick={() => {
                  setStep(1);
                }}
              >
                Voltar
              </Button>
              <Button
                onClick={() => {
                  onClose();
                }}
                variant="primary"
              >
                Salvar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}