import { Filter } from "@/icons/Filter";
import { Search } from "@/icons/Search";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Pagination } from "@/ui/Pagination";
import { Table } from "@/ui/Table";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/hooks/useOrders";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { FilterOptions } from "@/components/FilterOptions";
import { DASHBOARD_FILTER_OPTIONS } from "@/constants";
import { DashboardTabs } from "./DashboardTabs";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "react-toastify";

export default function Review() {
  const [orderId, setOrderId] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const {
    orders,
    loading,
    handlePageClick,
    states: { search, setSearch, selectedFilter, setSelectedFilter },
    removeOrder,
  } = useOrders("conferencia");

  const navigate = useNavigate();
  const { authorize } = useProfile();

  const handleActionChoice = (id: string) => id !== orderId && setOrderId(id);

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleSelectFilter = (filter: string) => setSelectedFilter(filter);

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Suas vendas</Subtitle>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-0 sm:gap-6">
          {selectedFilter && (
            <Input
              data={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search />}
              iconPosition="left"
              wide
              className="bg-neutral-0 w-full"
            />
          )}
          {showFilters && (
            <FilterOptions
              selectedFilter={selectedFilter}
              onClose={toggleFilters}
              onSelectFilter={handleSelectFilter}
              filterOptions={DASHBOARD_FILTER_OPTIONS}
            />
          )}
          <Button
            variant="naked"
            color="default"
            className="border"
            onClick={toggleFilters}
          >
            <Filter />{" "}
            <Caption variant="large">
              {DASHBOARD_FILTER_OPTIONS.find((option) => option.value === selectedFilter)
                ?.label || "Filtrar"}
            </Caption>
          </Button>
        </div>
      </div>
      <DashboardTabs />

      {loading ? (
        <SpinningLogo />
      ) : (
        orders && (
          <>
            <Table
              actionButton
              data={orders.data}
              headers={[
                { label: "Código", key: "orderNumber" },
                { label: "Vendedor", key: "SellerId.name" },
                { label: "Tipo", key: "local" },
                { label: "Pagamento", key: "ReceiptPayments" },
                { label: "Status", key: "status" },
                { label: "Valor", key: "totalPrice" },
                { label: "Data", key: "createdAt" },
              ]}
              customMappings={{
                status: {
                  entregue: "Entregue",
                  separacao: "Separação",
                  conferencia: "Conferência",
                  pendente: "Pendente",
                },
                local: {
                  online: "Online",
                  presencial: "Presencial",
                },
              }}
              dateFields={["createdAt"]}
              monetaryFields={["totalPrice"]}
              setSelectId={handleActionChoice}
              onReview={
                authorize("w_conference_orders")
                  ? () => navigate(`/dashboard/review/${orderId}`)
                  : undefined
              }
              onDelete={() => {
                if (removeOrder) {
                  removeOrder(orderId);
                } else {
                  toast.error("Você não tem permissão para excluir pedidos");
                }
              }}
              onDetail={
                authorize("r_conference_orders")
                  ? () => navigate(`/sales/${orderId}`)
                  : undefined
              }
              deleteTitle="Você tem certeza que deseja excluir essa venda?"
              deleteDescription="Ao excluir essa venda não será possível recupera-la e ela será excluída da suas métricas de venda "
            />
            <Pagination
              currentPage={orders.currentPage}
              totalItems={orders.totalItems}
              totalPages={orders.totalPages}
              limit={orders.data.length}
              handlePageClick={handlePageClick}
            />
          </>
        )
      )}
    </div>
  );
}
