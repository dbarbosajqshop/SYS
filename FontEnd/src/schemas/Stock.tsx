import { IPostStock } from "@/types/stock";
import { Input } from "@/ui/Input";

type StockProps = {
  stockData: IPostStock;
  setStockData: (
    userData:
      | StockProps["stockData"]
      | ((prevData: StockProps["stockData"]) => StockProps["stockData"])
  ) => void;
  errors: { [key: string]: string };
};

export const Stock = ({ stockData, setStockData, errors }: StockProps) => {
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStockData((prevData: StockProps["stockData"]) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Input
        wide
        name="name"
        data={stockData?.name}
        label="Nome do estoque"
        onChange={handleInputChange}
        placeholder="Insira o nome do estoque"
        error={errors.name}
      />
      <Input
        wide
        name="description"
        data={stockData?.description}
        label="Descrição"
        onChange={handleInputChange}
        placeholder="Insira uma descrição para o estoque"
        error={errors.description}
      />
      <Input
        wide
        name="code"
        data={stockData?.code}
        label="Código"
        onChange={handleInputChange}
        placeholder="Insira o código"
        error={errors.code}
        maxLength={3}
      />
    </div>
  );
};
