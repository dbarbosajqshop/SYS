import { Add } from "@/icons/Add";
import { Button } from "@/ui/Button";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState } from "react";
import { Table } from "@/ui/Table";
import { FormModal } from "@/ui/FormModal";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { IPostTax } from "@/types/taxes";
import { useTaxes } from "@/hooks/useTaxes";
import { useCreateTax } from "@/hooks/useCreateTax";
import { Tax } from "@/schemas/Tax";
import { RegisterTabs } from "./RegisterTabs";
import { useProfile } from "@/hooks/useProfile";

export default function Taxes() {
  const [openModal, setOpenModal] = useState(false);
  const [taxData, setTaxData] = useState<IPostTax>({} as IPostTax);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [editData, setEditData] = useState<IPostTax>({} as IPostTax);
  const [taxId, settaxId] = useState("");
  const [editModal, setEditModal] = useState(false);

  const { taxes, loading, fetchTaxes, addTax, updateTax, removeTax, fetchTax } =
    useTaxes();

  const { authorize } = useProfile();

  const fetchAndSetTax = async (id: string) => {
    if (id && taxes) {
      const tax = await fetchTax(id);
      const edited = {
        name: tax?.name,
        retailTaxPercentage: tax?.retailTaxPercentage,
        wholesaleTaxPercentage: tax?.wholesaleTaxPercentage,
        minWholesaleQuantity: tax?.minWholesaleQuantity,
        selected: tax?.selected,
      };
      setEditData(edited);
    }
  };

  const { handleSubmit } = useCreateTax(
    taxData,
    setTaxData,
    addTax,
    setErrors,
    setOpenModal
  );

  const handleEdit = () => {
    updateTax(taxId, editData);

    setEditModal(false);
    setEditData({} as IPostTax);
  };

  const handleEditChoice = async () => {
    await fetchAndSetTax(taxId);
    setEditModal(true);
  };

  const handleActionChoice = (id: string) => id !== taxId && settaxId(id);

  const handlePageClick = (page: number) => {
    fetchTaxes({
      page,
    });
  };

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      {!loading && (
        <>
          <FormModal
            open={openModal}
            setOpen={setOpenModal}
            entity="taxa"
            mode="Criar"
            onSubmit={handleSubmit}
          >
            <Tax setTaxData={setTaxData} taxData={taxData} errors={errors} />
          </FormModal>

          <FormModal
            open={editModal}
            setOpen={setEditModal}
            entity="taxa"
            mode="Editar"
            onSubmit={handleEdit}
          >
            <Tax setTaxData={setEditData} taxData={editData} errors={errors} />
          </FormModal>
        </>
      )}

      <div className="flex flex-wrap sm:flex-nowrap taxes-center justify-between">
        <Subtitle variant="large">Cadastro</Subtitle>
        <div className="flex flex-wrap sm:flex-nowrap taxes-center gap-0 sm:gap-6">
          {authorize("w_tax") && (
            <Button
              variant="naked"
              color="default"
              className="border  w-full"
              onClick={() => setOpenModal(true)}
            >
              <Add /> <Caption variant="large">Criar Taxa</Caption>
            </Button>
          )}
        </div>
      </div>
      <RegisterTabs />

      {loading ? (
        <SpinningLogo />
      ) : (
        taxes && (
          <>
            <Table
              actionButton
              data={taxes.data}
              headers={[
                { label: "Nome", key: "name" },
                { label: "Porcentagem varejo", key: "retailTaxPercentage" },
                { label: "Porcentagem atacado", key: "wholesaleTaxPercentage" },
                {
                  label: "Quantidade mínima para atacado",
                  key: "minWholesaleQuantity",
                },
                { label: "Ativo", key: "selected" },
              ]}
              customMappings={{
                selected: {
                  true: "Ativo",
                  false: "Não",
                },
              }}
              percentageFields={["retailTaxPercentage", "wholesaleTaxPercentage"]}
              setSelectId={handleActionChoice}
              onDelete={authorize("d_tax") ? () => removeTax(taxId) : undefined}
              onEdit={authorize("u_tax") ? handleEditChoice : undefined}
              deleteTitle="Você tem certeza que deseja excluir essa taxa?"
              deleteDescription="Ao excluir essa taxa não será possível recupera-la."
            />
            <Pagination
              currentPage={taxes.currentPage}
              totalItems={taxes.totalItems}
              totalPages={taxes.totalPages}
              limit={taxes.data.length}
              handlePageClick={handlePageClick}
            />
          </>
        )
      )}
    </div>
  );
}
