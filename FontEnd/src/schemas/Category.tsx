import { IPostCategory } from "@/types/categories";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";

type categoryProps = {
  categoryData: IPostCategory;
  errors: { [key: string]: string };
  setCategoryData: (
    categoryData:
      | categoryProps["categoryData"]
      | ((prevData: categoryProps["categoryData"]) => categoryProps["categoryData"])
  ) => void;
};

export const Category = ({ categoryData, setCategoryData, errors }: categoryProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "commission") {
      const regex = /^\d{0,}(,\d{0,})?$/;
      if (!regex.test(value)) return;
    }

    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const getError = (field: string) => {
    return errors[field] || "";
  };

  return (
    <div>
      <Subtitle variant="large-semibold">Informações da categoria</Subtitle>
      <Input
        wide
        name="name"
        data={categoryData?.name}
        label="Nome"
        placeholder="Insira o nome da categoria"
        onChange={handleInputChange}
        error={getError("name")}
      />
      <Input
        wide
        name="description"
        data={categoryData?.description || ""}
        label="Descrição"
        placeholder="Insira a descrição da categoria"
        onChange={handleInputChange}
        error={getError("description")}
      />
      <Input
        wide
        icon="%"
        iconPosition="right"
        name="commission"
        data={categoryData?.commission || ""}
        label="Comissão"
        placeholder="Insira a porcentagem de comissão"
        onChange={handleInputChange}
        error={getError("commission")}
      />
    </div>
  );
};
