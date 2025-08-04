import { useNavigate } from "react-router-dom";
import { Add } from "@/icons/Add";
import { Button } from "@/ui/Button";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState } from "react";
import { Table } from "@/ui/Table";
import { FormModal } from "@/ui/FormModal";
import { Stock as StockSchema } from "@/schemas/Stock";
import { IPutStock } from "@/types/stock";
import { useStocks } from "@/hooks/useStocks";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useCreateStock } from "@/hooks/useCreateStock";
import { RegisterTabs } from "./RegisterTabs";
import { useProfile } from "@/hooks/useProfile";

export default function Stocks() {
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [stockData, setStockData] = useState({
    name: "",
    description: "",
    code: "",
  });
  const [editData, setEditData] = useState<IPutStock>({} as IPutStock);
  const [stockId, setStockId] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { authorize } = useProfile();

  const navigate = useNavigate();

  const { stocks, loading, addStock, removeStock, fetchStock, fetchStocks, updateStock } =
    useStocks();

  const { handleSubmit } = useCreateStock(
    isEditing ? editData : stockData,
    isEditing ? setEditData : setStockData,
    addStock,
    updateStock,
    setErrors,
    isEditing ? setEditModal : setOpenModal,
    isEditing,
    stockId
  );

  const fetchAndSetStock = async (id: string) => {
    if (id) {
      const stock = await fetchStock(id);
      const edited = {
        name: stock.name,
        description: stock.description,
        code: stock.code,
        type: stock.type,
      };
      setEditData(edited);
    }
  };

  const handleEditChoice = async () => {
    await fetchAndSetStock(stockId);
    setEditModal(true);
    setIsEditing(true);
  };

  const handleActionChoice = (id: string) => id !== stockId && setStockId(id);

  const handlePageClick = (selected: number) => {
    if (stocks && selected !== stocks.currentPage) fetchStocks(selected);
  };

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      {!loading && (
        <>
          <FormModal
            open={openModal}
            setOpen={setOpenModal}
            entity="estoque"
            mode="Criar"
            onSubmit={handleSubmit}
          >
            <StockSchema
              setStockData={setStockData}
              stockData={stockData}
              errors={errors}
            />
          </FormModal>

          <FormModal
            open={editModal}
            setOpen={setEditModal}
            entity="estoque"
            mode="Editar"
            onSubmit={handleSubmit}
          >
            <StockSchema
              setStockData={setEditData}
              stockData={editData}
              errors={errors}
            />
          </FormModal>
        </>
      )}

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Cadastro</Subtitle>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-0 sm:gap-6">
          {authorize("w_stock") && (
            <Button
              variant="naked"
              color="default"
              className="border w-full"
              onClick={() => {
                setOpenModal(true);
                setIsEditing(false);
              }}
            >
              <Add /> <Caption variant="large">Criar estoque</Caption>
            </Button>
          )}
        </div>
      </div>

      <RegisterTabs />

      {loading ? (
        <SpinningLogo />
      ) : (
        stocks && (
          <>
            <Table
              actionButton
              data={stocks.data}
              headers={[
                { label: "Código", key: "code" },
                { label: "Nome do estoque", key: "name" },
                { label: "Descrição", key: "description" },
                { label: "Ruas", key: "totals.streets" },
                { label: "Prédios", key: "totals.builds" },
                { label: "Andares", key: "totals.floors" },
              ]}
              setSelectId={handleActionChoice}
              onDelete={authorize("d_stock") ? () => removeStock(stockId) : undefined}
              onEdit={authorize("u_stock") ? handleEditChoice : undefined}
              onDetail={
                authorize("r_stock")
                  ? () => navigate(`/register/stocks/${stockId}`)
                  : undefined
              }
              deleteTitle="Você tem certeza que deseja excluir esse estoque?"
              deleteDescription="Ao excluir esse estoque não será possível recupera-lo e nem os itens anexados a ele"
            />
            <Pagination
              currentPage={stocks.currentPage}
              totalItems={stocks.totalItems}
              totalPages={stocks.totalPages}
              limit={stocks.data.length}
              handlePageClick={handlePageClick}
            />
          </>
        )
      )}
    </div>
  );
}
