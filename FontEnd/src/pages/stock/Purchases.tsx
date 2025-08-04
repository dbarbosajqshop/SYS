import { usePurchases } from "@/hooks/usePurchases";
import { Add } from "@/icons/Add";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { Button } from "@/ui/Button";
import { Pagination } from "@/ui/Pagination";
import { Table } from "@/ui/Table";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { StockTabs } from "./StockTabs";

export default function Purchases() {
  const [purchaseId, setPurchaseId] = useState("");

  const navigate = useNavigate();
  const { authorize } = useProfile();
  const { purchases, fetchPurchases, loading } = usePurchases();

  const handleActionChoice = (id: string) => id !== purchaseId && setPurchaseId(id);

  const handlePageClick = (page: number) => fetchPurchases(page);

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Compras</Subtitle>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-0 sm:gap-6">
          {authorize("w_purchase") && (
            <Button
              variant="naked"
              color="default"
              className="border w-full"
              onClick={() => navigate("/stock/purchases/new-purchase")}
            >
              <Add /> <Caption variant="large">Nova compra</Caption>
            </Button>
          )}
        </div>
      </div>

      <StockTabs />

      {loading ? (
        <SpinningLogo />
      ) : (
        purchases && (
          <>
            <Table
              actionButton
              data={purchases.data}
              headers={[
                { label: "Loja", key: "store" },
                { label: "Itens", key: "totalItems" },
                { label: "Data", key: "purchaseDate" },
                { label: "Status", key: "state" },
              ]}
              customMappings={{
                state: {
                  entregue: "Entregue",
                  separacao: "Separação",
                  conferencia: "Conferência",
                  pendente: "Pendente",
                },
              }}
              dateFields={["purchaseDate"]}
              setSelectId={handleActionChoice}
              onDetail={() => navigate(`/stock/purchases/${purchaseId}`)}
              detailText="Conferir Compra"
              deleteTitle="Você tem certeza que deseja excluir esse estoque?"
              deleteDescription="Ao excluir esse estoque não será possível recupera-lo e nem os itens anexados a ele"
            />
            <Pagination
              currentPage={purchases.currentPage}
              totalItems={purchases.totalItems}
              totalPages={purchases.totalPages}
              limit={purchases.data.length}
              handlePageClick={handlePageClick}
            />
          </>
        )
      )}
    </div>
  );
}
