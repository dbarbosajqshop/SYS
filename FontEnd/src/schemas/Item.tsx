import { IPostItem } from "@/types/items";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Subtitle } from "@/ui/typography/Subtitle";
import { toast } from "react-toastify";
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";
import { Select } from "@/ui/Select";
import { useCategories } from "@/hooks/useCategories";
import { useState } from "react";

type ItemProps = {
  itemData: IPostItem;
  setItemData: (
    userData:
      | ItemProps["itemData"]
      | ((prevData: ItemProps["itemData"]) => ItemProps["itemData"])
  ) => void;
  itemPhoto: File | null;
  setItemPhoto: (photo: File) => void;
  errors: { [key: string]: string };
};

export const Item = ({
  itemData,
  setItemData,
  itemPhoto,
  setItemPhoto,
  errors,
}: ItemProps) => {
  const [upcInput, setUpcInput] = useState("");
  const { categoriesList } = useCategories();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;

    setItemData((prevData: ItemProps["itemData"]) => {
      const updatedData = {
        ...prevData,
        [name]:
          type === "checkbox"
            ? checked
            : name === "price" ||
              name === "quantityBox" ||
              name === "width" ||
              name === "height" ||
              name === "weight" ||
              name === "depth" ||
              name === "promotionPrice" ||
              name === "wholesalePrice" ||
              name === "retailPrice" ||
              name === "ncm"
            ? Number(value) || ""
            : value,
      };

      if (name === "isPromotion" && checked) updatedData.taxPrices = false;
      else if (name === "taxPrices" && checked) updatedData.isPromotion = false;

      return updatedData;
    });
  };

  const handleMonetaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const numericValue = value.replace(/\D/g, "");

    const paddedValue = numericValue.padStart(3, "0");

    const integerPart = paddedValue.slice(0, -2);
    const decimalPart = paddedValue.slice(-2);

    const formattedValue = `${parseInt(integerPart, 10)},${decimalPart}`;

    setItemData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleImageUpload = (file: File | undefined) => {
    if (file && file.size / 1024 / 1024 > 10)
      return toast.error("O arquivo deve ter no máximo 10MB");

    if (file) {
      setItemPhoto(file);
    }
  };

  const handleAddUpc = () => {
    const numericUpc = upcInput.replace(/\D/g, "").trim();
    if (numericUpc && !(itemData.upcList ?? []).includes(numericUpc)) {
      setItemData((prev) => ({
        ...prev,
        upcList: [...(prev.upcList ?? []), numericUpc],
      }));
      setUpcInput("");
    }
  };

  // Remove um UPC da lista
  const handleRemoveUpc = (upc: string) => {
    setItemData((prev) => ({
      ...prev,
      upcList: prev.upcList.filter((code) => code !== upc),
    }));
  };

  return (
    <div>
      <Subtitle variant="large-semibold">Informações do produto</Subtitle>
      <div className="flex items-center flex-wrap sm:flex-nowrap justify-between gap-5 mt-3">
        <div className="sm:min-w-44 sm:w-44 sm:h-44 min-w-24 w-24 h-24 border border-neutral-200">
          {itemPhoto ? (
            <img
              src={URL.createObjectURL(itemPhoto)}
              alt="Imagem do produto"
              className="w-full h-full object-cover"
            />
          ) : itemData.imageUrl ? (
            <img
              src={itemData.imageUrl}
              alt="Imagem do produto"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`flex items-center justify-center w-full h-full bg-neutral-200`}
            >
              <img
                src={"/no-image.jpeg"}
                alt="Imagem do produto"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 items-start">
          <Paragraph variant="large-semibold">Imagem</Paragraph>
          <Paragraph color="text-neutral-500">
            Faça upload de uma imagem de seu produto em PNG ou JPEG com no máximo 10MB
          </Paragraph>

          <ImgCrop
            onModalOk={(e) => {
              handleImageUpload(e as File);
            }}
          >
            <Upload
              beforeUpload={() => {}}
              customRequest={() => {}}
              id="fileInput"
              accept="image/png, image/jpeg"
              fileList={[]}
            >
              <Button>Fazer upload</Button>
            </Upload>
          </ImgCrop>
        </div>
      </div>
      <Input
        wide
        name="name"
        data={itemData?.name}
        label="Nome do item*"
        onChange={handleInputChange}
        placeholder="Insira o nome do item"
        error={errors.name}
      />
      <Select
        wide
        name="category"
        data={itemData?.category}
        onChange={handleInputChange}
        label="Categoria"
        options={
          categoriesList && categoriesList?.length > 0
            ? categoriesList?.map((category) => ({
                label: category.name,
                value: category._id,
              }))
            : []
        }
      />
      <Input
        icon={"R$"}
        wide
        name="price"
        data={itemData?.price?.toString() || ""}
        label="Valor unitário de caixa fechada*"
        onChange={handleMonetaryChange}
        placeholder="00,00"
        error={errors.price}
      />
      <Input
        wide
        name="quantityBox"
        data={itemData?.quantityBox?.toString() || ""}
        label="Unidades por caixa*"
        onChange={handleInputChange}
        placeholder="Insira a quantidade"
        error={errors.quantityBox}
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isPromotion"
          checked={itemData.isPromotion}
          onChange={handleInputChange}
        />
        <Paragraph variant="large-semibold">Ativar valor de promoção</Paragraph>
      </label>
      {itemData.isPromotion && (
        <Input
          icon={"R$"}
          wide
          name="promotionPrice"
          data={itemData?.promotionPrice?.toString() || ""}
          label="Valor de promoção"
          onChange={handleMonetaryChange}
          placeholder="00,00"
          error={errors.promotionPrice}
        />
      )}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="taxPrices"
          checked={itemData.taxPrices}
          onChange={handleInputChange}
        />
        <Paragraph variant="large-semibold">Ativar valor de atacado/varejo</Paragraph>
      </label>
      {itemData.taxPrices && (
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
          <Input
            icon={"R$"}
            wide
            name="wholesalePrice"
            data={itemData?.wholesalePrice?.toString() || ""}
            label="Valor de atacado"
            onChange={handleMonetaryChange}
            placeholder="00,00"
            error={errors.wholesalePrice}
          />
          <Input
            icon={"R$"}
            wide
            name="retailPrice"
            data={itemData?.retailPrice?.toString() || ""}
            label="Valor de varejo"
            onChange={handleMonetaryChange}
            placeholder="00,00"
            error={errors.retailPrice}
          />
        </div>
      )}

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
        <Input
          className="bg-neutral-100 w-full"
          wide
          name="color"
          data={itemData?.color}
          label="Cor"
          onChange={handleInputChange}
          placeholder="Insira a cor"
          error={errors.color}
        />
        <Input
          className="bg-neutral-100 w-full"
          wide
          name="sku"
          data={itemData?.sku}
          label="SKU *"
          onChange={handleInputChange}
          placeholder="Insira o SKU"
          error={errors.sku}
        />
      </div>
      <Input
        className="bg-neutral-100 w-full"
        wide
        name="ncm"
        data={itemData?.ncm || ""}
        label="NCM"
        onChange={handleInputChange}
        placeholder="Insira o NCM"
        error={errors.ncm}
        maxLength={8}
      />
      <div className="w-full">
        <label className="block mb-1 font-semibold">Códigos de barras (UPC)</label>
        <div className="flex gap-2 items-center">
          <Input
            className="bg-neutral-100 w-full"
            wide
            name="upcInput"
            data={upcInput}
            label=""
            onChange={(e) => {
              setUpcInput(e.target.value.replace(/\D/g, ""));
            }}
            placeholder="Insira código de barras"
            error={errors.upcList}
          />
          <Button type="button" onClick={handleAddUpc}>
            Adicionar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {itemData.upcList?.map((upc) => (
            <span
              key={upc}
              className="bg-neutral-200 px-2 py-1 rounded flex items-center gap-1"
            >
              {upc}
              <button
                type="button"
                className="ml-1 text-red-500"
                onClick={() => handleRemoveUpc(upc)}
                title="Remover"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
      <Subtitle variant="large-semibold">Tamanho e peso</Subtitle>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
        <Input
          icon={"cm"}
          iconPosition="right"
          className="bg-neutral-100 w-full"
          wide
          name="depth"
          data={itemData?.depth?.toString() || ""}
          label="Comprimento"
          onChange={handleInputChange}
          placeholder="Insira o comprimento"
          error={errors.depth}
        />
        <Input
          icon={"cm"}
          iconPosition="right"
          className="bg-neutral-100 w-full"
          wide
          name="width"
          data={itemData?.width?.toString() || ""}
          label="Largura *"
          onChange={handleInputChange}
          placeholder="Insira a largura"
          error={errors.width}
        />
      </div>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
        <Input
          icon={"cm"}
          iconPosition="right"
          className="bg-neutral-100 w-full"
          wide
          name="height"
          data={itemData?.height?.toString() || ""}
          label="Altura *"
          onChange={handleInputChange}
          placeholder="Insira a altura"
          error={errors.height}
        />
        <Input
          icon={"kg"}
          iconPosition="right"
          className="bg-neutral-100 w-full"
          wide
          name="weight"
          data={itemData?.weight?.toString() || ""}
          label="Peso *"
          onChange={handleInputChange}
          placeholder="Insira o peso"
          error={errors.weight}
        />
      </div>
    </div>
  );
};
