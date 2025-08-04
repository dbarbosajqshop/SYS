import { IPostTax } from "@/types/taxes";
import { Input } from "@/ui/Input";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Subtitle } from "@/ui/typography/Subtitle";

type TaxProps = {
  taxData: IPostTax;
  setTaxData: (
    userData:
      | TaxProps["taxData"]
      | ((prevData: TaxProps["taxData"]) => TaxProps["taxData"])
  ) => void;
  errors: { [key: string]: string };
};

export const Tax = ({ taxData, setTaxData, errors }: TaxProps) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;

    setTaxData((prevData: TaxProps["taxData"]) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : name === "retailTaxPercentage" ||
            name === "wholesaleTaxPercentage" ||
            name === "minWholesaleQuantity"
          ? Number(value) || 0
          : value,
    }));
  };

  return (
    <div>
      <Subtitle variant="large-semibold">Informações da taxa</Subtitle>
      <Input
        wide
        name="name"
        data={taxData?.name}
        label="Nome do taxa*"
        onChange={handleInputChange}
        placeholder="Insira o nome do taxa"
        error={errors.name}
      />
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
        <Input
          icon="%"
          iconPosition="right"
          wide
          name="retailTaxPercentage"
          maxLength={2}
          data={taxData?.retailTaxPercentage?.toString()}
          label="Porcentagem do varejo*"
          onChange={handleInputChange}
          placeholder="Insira a porcentagem"
          error={errors.retailTaxPercentage}
        />
        <Input
          icon="%"
          iconPosition="right"
          wide
          name="wholesaleTaxPercentage"
          maxLength={2}
          data={taxData?.wholesaleTaxPercentage?.toString()}
          label="Porcentagem do atacado*"
          onChange={handleInputChange}
          placeholder="Insira a porcentagem"
          error={errors.wholesaleTaxPercentage}
        />
      </div>
      <div className="flex flex-wrap sm:flex-nowrap gap-4">
        <Input
          wide
          name="minWholesaleQuantity"
          data={taxData?.minWholesaleQuantity?.toString()}
          label="Quantidade mínima para atacado*"
          onChange={handleInputChange}
          placeholder="Insira a quantidade mínima"
          error={errors.minWholesaleQuantity}
        />
        <label className="flex items-center gap-2 w-full">
          <input
            className="w-4 h-4"
            type="checkbox"
            name="selected"
            checked={taxData.selected}
            onChange={handleInputChange}
          />
          <Paragraph variant="large-semibold">Ativo</Paragraph>
        </label>
      </div>
    </div>
  );
};
