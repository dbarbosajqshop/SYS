import { IPostFloor } from "@/types/floor";
import { Input } from "@/ui/Input";
import { Select } from "@/ui/Select";

type FloorProps = {
  floorData: IPostFloor;
  setFloorData: (
    floorData:
      | FloorProps["floorData"]
      | ((prevData: FloorProps["floorData"]) => FloorProps["floorData"])
  ) => void;
};

export const Floor = ({ floorData, setFloorData }: FloorProps) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFloorData((prevData: FloorProps["floorData"]) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Input
        wide
        name="name"
        data={floorData?.name}
        label="Nome do andar"
        onChange={handleInputChange}
        placeholder="Insira o nome do andar"
      />
      <Input
        wide
        name="description"
        data={floorData?.description}
        label="Descrição"
        onChange={handleInputChange}
        placeholder="Insira uma descrição para o andar"
      />
      <Input
        wide
        name="code"
        data={floorData?.code}
        label="Código"
        onChange={handleInputChange}
        placeholder="Insira o código"
      />
      <Select
        wide
        name="orderLocal"
        data={floorData?.orderLocal}
        label="Local de pedido"
        onChange={handleInputChange}
        options={["Online", "Presencial"].map((status) => ({
          value: status.toLowerCase(),
          label: status,
        }))}
      />
    </div>
  );
};
