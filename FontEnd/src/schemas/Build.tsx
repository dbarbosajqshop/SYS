import { IPostBuild } from "@/types/build";
import { Input } from "@/ui/Input";

type BuildProps = {
  buildData: IPostBuild;
  setBuildData: (
    buildData:
      | BuildProps["buildData"]
      | ((prevData: BuildProps["buildData"]) => BuildProps["buildData"])
  ) => void;
};

export const Build = ({ buildData, setBuildData }: BuildProps) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBuildData((prevData: BuildProps["buildData"]) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Input
        wide
        name="name"
        data={buildData?.name}
        label="Nome do prédio"
        onChange={handleInputChange}
        placeholder="Insira o nome do prédio"
      />
      <Input
        wide
        name="description"
        data={buildData?.description}
        label="Descrição"
        onChange={handleInputChange}
        placeholder="Insira uma descrição para o prédio"
      />
      <Input
        wide
        name="code"
        data={buildData?.code}
        label="Código"
        onChange={handleInputChange}
        placeholder="Insira o código"
      />
    </div>
  );
};
