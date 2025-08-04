import { IPostClient } from "@/types/client";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { getAddressFromCep } from "@/services/cep";
import { toast } from "react-toastify";

type ClientProps = {
  clientData: IPostClient;
  erros: { [key: string]: string };
  setClientData: (
    clientData:
      | ClientProps["clientData"]
      | ((prevData: ClientProps["clientData"]) => ClientProps["clientData"])
  ) => void;
};

export const Client = ({ clientData, setClientData, erros }: ClientProps) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.replace("address.", "");

      setClientData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else {
      setClientData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleBuscaEndereco = async () => {
    const cep = clientData?.address?.zip?.replace(/\D/g, "");

    if (!cep || cep.length !== 8) {
      toast.error("CEP inválido");
      return;
    }

    const endereco = await getAddressFromCep(cep);

    if (endereco?.erro) {
      toast.error("CEP não encontrado");
      return;
    }

    setClientData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        street: endereco.logradouro || '',
        neighborhood: endereco.bairro || '',
        city: endereco.localidade || '',
        state: endereco.uf || '',
        complement: prevData.address?.complement || ''
      },
    }));
  };

  const getError = (field: string) => {
    return erros[field] || "";
  };

  return (
    <div>
      <Subtitle variant="large-semibold">Informações do cliente</Subtitle>
      <Input
        wide
        name="name"
        data={clientData?.name}
        label="Nome completo"
        placeholder="Insira o nome do cliente"
        onChange={handleInputChange}
        error={getError("name")}
      />
      <Input
        wide
        name="email"
        data={clientData?.email}
        label="E-mail"
        placeholder="Insira o e-mail do cliente"
        onChange={handleInputChange}
        error={getError("email")}
      />
      <Input
        wide
        name="telephoneNumber"
        data={clientData?.telephoneNumber}
        label="Telefone"
        placeholder="Insira o seu telefone"
        onChange={handleInputChange}
        error={getError("telephoneNumber")}
      />
      <Input
        wide
        name="cpf"
        data={clientData?.cpf as string}
        label="CPF ou CNPJ"
        placeholder="Insira o CPF ou CNPJ"
        onChange={handleInputChange}
        error={getError("cpf")}
      />

      <div className="flex justify-between items-center mt-4">
        <Subtitle variant="large-semibold">Endereço do cliente</Subtitle>
        <button
          type="button"
          onClick={handleBuscaEndereco}
          className="text-sm text-blue-600 hover:underline"
        >
          Buscar endereço por CEP
        </button>
      </div>
      <Input
        className="bg-neutral-100 w-full"
        wide
        name="address.zip"
        data={clientData?.address?.zip}
        label="CEP"
        onChange={handleInputChange}
        placeholder="Insira o CEP"
        error={getError("address.zip")}
      />
      <Input
        wide
        name="address.street"
        data={clientData?.address?.street}
        label="Rua"
        placeholder="Insira a rua"
        onChange={handleInputChange}
        error={getError("address.street")}
      />
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
        <Input
          className="bg-neutral-100 w-full"
          wide
          name="address.neighborhood"
          data={clientData?.address?.neighborhood}
          label="Bairro"
          onChange={handleInputChange}
          placeholder="Insira o bairro"
          error={getError("address.neighborhood")}
        />
        <Input
          className="bg-neutral-100 w-full"
          wide
          name="address.number"
          data={clientData?.address?.number?.toString()}
          label="Número"
          onChange={handleInputChange}
          placeholder="Insira o número"
          error={getError("address.number")}
        />
      </div>
      <Input
        wide
        name="address.complement"
        data={clientData?.address?.complement ?? ''}
        label="Complemento"
        placeholder="Insira o complemento"
        onChange={handleInputChange}
        error={getError("address.complement")}
      />
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
        <Input
          wide
          name="address.city"
          data={clientData?.address?.city}
          label="Cidade"
          placeholder="Insira a cidade"
          onChange={handleInputChange}
          error={getError("address.city")}
        />
        <Input
          className="bg-neutral-100 w-full"
          wide
          name="address.state"
          data={clientData?.address?.state}
          label="Estado"
          onChange={handleInputChange}
          placeholder="Insira o estado"
          error={getError("address.state")}
          maxLength={2}
        />
      </div>
    </div>
  );
};
