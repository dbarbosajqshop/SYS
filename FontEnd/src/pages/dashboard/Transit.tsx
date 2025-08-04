import { Filter } from "@/icons/Filter";
import { Search } from "@/icons/Search";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Pagination } from "@/ui/Pagination";
import { Table } from "@/ui/Table";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "@/hooks/useOrders";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { FilterOptions } from "@/components/FilterOptions";
import { DASHBOARD_FILTER_OPTIONS } from "@/constants";
import { useDebounce } from "use-debounce";
import { DashboardTabs } from "./DashboardTabs";
import { toast } from "react-toastify";

export default function Transit() {
  const [search, setSearch] = useState("");
  const [orderId, setOrderId] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  const [dSearch] = useDebounce(search, 500);

  const { orders, loading, fetchOrders, removeOrder, handlePageClick } = useOrders("transito");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders({ search: dSearch, param: selectedFilter, status: "transito" });
  }, [selectedFilter, dSearch]);

  const handleActionChoice = (id: string) => {
    if (id !== orderId) {
      setOrderId(id);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSelectFilter = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Suas vendas</Subtitle>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-0 sm:gap-6">
          <Input
            data={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search />}
            iconPosition="left"
            wide
            className="bg-neutral-0 w-full"
          />
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
              {DASHBOARD_FILTER_OPTIONS.find(
                (option) => option.value === selectedFilter
              )?.label || "Filtrar"}
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
              onDelete={() => {
                if (removeOrder) {
                  removeOrder(orderId);
                } else {
                  toast.error("Você não tem permissão para excluir pedidos");
                }
              }}
              onDetail={() => navigate(`/sales/${orderId}`)}
              deleteTitle="Você tem certeza que deseja excluir essa venda?"
              deleteDescription="Ao excluir essa venda não será possível recupera-la e ela será excluída da suas métricas de venda "
            />
            <Pagination
              currentPage={orders.currentPage}
              totalItems={orders.totalOrders}
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
