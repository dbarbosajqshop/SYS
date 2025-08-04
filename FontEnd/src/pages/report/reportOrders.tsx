import { SpinningLogo } from "@/icons/SpinningLogo";
import { Pagination } from "@/ui/Pagination";
import { Table } from "@/ui/Table";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useNavigate } from "react-router-dom";
import { Column } from "@/components/column";
import { Row } from "@/components/row";
import { useState } from "react";
import { OverviewCard } from "@/components/OverviewCard";
import { Package, User } from "lucide-react";
import { ReportFilters } from "@/ReportFilters";
import { Monetization } from "@/icons/Monetization";
import { formatCurrencyText } from "@/helpers";
// import { ReportTabs } from "./ReportTabs"; // REMOVA ESTA IMPORTAÇÃO
import { useReportOrders } from "./useReportOrders";
import { IconButton } from "@/ui/IconButton";
import { ArrowBack } from "@/icons/ArrowBack";

export const ReportOrders = () => {
  const [orderId, setOrderId] = useState("");

  const {
    orders,
    filters,
    ordersDashboard,
    handleSetFilter,
    setFilters,
    setPage,
    onChangePayments,
    payments,
  } = useReportOrders();

  const navigate = useNavigate();

  const handleActionChoice = (id: string) => id !== orderId && setOrderId(id);

  return (
    <div className="flex flex-col gap-6 py-sm px-sm sm:px-md bg-neutral-100 h-full">
      <div className="flex items-center gap-3">
        <IconButton
          size="large"
          iconColor="#71717A"
          onClick={() => navigate("/report")} // Navega de volta para o hub de relatórios
        >
          <ArrowBack />
        </IconButton>
        <Subtitle variant="medium" color="text-neutral-500">
          Relatórios / Vendas
        </Subtitle>
      </div>

      <Row>
        <Column className="w-full">
          <Column className="w-full sm:gap-4 h-full justify-between bg-neutral-0 rounded-nano border p-sm">
            <Row className="relative">
              <Column>
                <Subtitle variant="large-semibold">Métricas</Subtitle>
                <Subtitle variant="large">Acompanhe suas métricas </Subtitle>
              </Column>
            </Row>

            <Row className="sm:gap-3 flex-wrap">
              <OverviewCard
                className="px-4 max-h-28"
                icon={<Package className="size-7" />}
                title="Total de vendas"
                value={ordersDashboard?.totalVendasMesCount || 0}
              />
              <OverviewCard
                className="px-4 max-h-28"
                icon={<Monetization />}
                title="Valor Total de Vendas"
                value={formatCurrencyText(
                  String(ordersDashboard?.totalVendasMesValue?.toFixed(2) || "0000")
                )}
              />
              <OverviewCard
                className="px-4 max-h-28"
                disabled={!filters?.SellerId}
                icon={<User className="size-7" />}
                title="Total de vendas P/ Usuário"
                value={ordersDashboard?.totalVendasVendedorCount || 0}
              />{" "}
              <OverviewCard
                className="px-4 max-h-28 "
                disabled={!filters?.SellerId}
                icon={
                  <Row className="sm:gap-0 items-end">
                    <User className="size-7 -mr-1" />{" "}
                    <Monetization width={20} height={20} />
                  </Row>
                }
                title="Total de vendas P/ Usuário"
                value={formatCurrencyText(
                  String(ordersDashboard?.totalVendasVendedorValue?.toFixed(2) || "0000")
                )}
              />
            </Row>
          </Column>
        </Column>
      </Row>
      <div className="flex flex-col min-h-[50vh] gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
        <Column>
          <Row className="items-start">
            <Subtitle variant="large-semibold" color="text-neutral-800">
              Vendas
            </Subtitle>

            <ReportFilters
              payments={payments}
              onChangePayments={onChangePayments}
              filters={filters}
              setFilters={setFilters}
              handleSetFilter={handleSetFilter}
            />
          </Row>
        </Column>
        {orders ? (
          orders?.data?.length ? (
            <>
              <Table
                actionButton
                data={orders.data || []}
                headers={[
                  { label: "Código", key: "orderNumber" },
                  { label: "Vendedor", key: "SellerId.name" },
                  { label: "Local", key: "local" },
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
                  typeOfPayment: {
                    dinheiro: "Dinheiro",
                    pix: "PIX",
                    credito: "Crédito",
                    debito: "Débito",
                    ted: "TED",
                  },
                }}
                dateFields={["createdAt"]}
                monetaryFields={["totalPrice"]}
                onDetail={() => navigate(`/sales/${orderId}`)}
                setSelectId={handleActionChoice}
                deleteTitle="Você tem certeza que deseja excluir essa venda?"
                deleteDescription="Ao excluir essa venda não será possível recupera-la e ela será excluída da suas métricas de venda "
              />
              <Pagination
                currentPage={orders?.currentPage}
                totalItems={orders?.totalItems}
                totalPages={orders?.totalPages}
                limit={orders?.data?.length}
                handlePageClick={(page) => setPage(page)}
              />
            </>
          ) : (
            <div className="my-auto h-1/2">
              <p className="text-center">Não há vendas para exibir</p>
            </div>
          )
        ) : (
          <div className="my-auto h-1/2">
            <SpinningLogo />
          </div>
        )}
      </div>
    </div>
  );
};