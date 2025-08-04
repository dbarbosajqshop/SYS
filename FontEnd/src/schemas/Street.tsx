import { IPostStreet } from "@/types/street";
import { Input } from "@/ui/Input";

type StreetProps = {
  streetData: IPostStreet;
  setStreetData: (
    streetData:
      | StreetProps["streetData"]
      | ((prevData: StreetProps["streetData"]) => StreetProps["streetData"])
  ) => void;
};

export const Street = ({ streetData, setStreetData }: StreetProps) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStreetData((prevData: StreetProps["streetData"]) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Input
        wide
        name="name"
        data={streetData?.name}
        label="Nome do rua"
        onChange={handleInputChange}
        placeholder="Insira o nome da rua"
      />
      <Input
        wide
        name="description"
        data={streetData?.description}
        label="Descrição"
        onChange={handleInputChange}
        placeholder="Insira uma descrição para a rua"
      />
      <Input
        wide
        name="code"
        data={streetData?.code}
        label="Código"
        onChange={handleInputChange}
        placeholder="Insira o código"
      />
    </div>
  );
};
