import { Subtitle } from "@/ui/typography/Subtitle";
import { Paragraph } from "@/ui/typography/Paragraph";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { redirectWarning } from "@/helpers/messagesWarnings";
import { Caption } from "@/ui/typography/Caption";
import { DollarSign, ShoppingCart, BarChart2, User } from "lucide-react";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { formatCurrencyText } from "@/helpers";
import { Column } from "@/components/column";
import { IconButton } from "@/ui/IconButton";
import { ArrowBack } from "@/icons/ArrowBack";
import { useCommissionReportData } from "../report/useCommissionReportData";
import { useSellersList } from "@/hooks/useSellersList";
import { useClients } from "@/hooks/useClients";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { OverviewCard } from "@/components/OverviewCard";
import { Row } from "@/components/row";
import { Table } from "@/ui/Table";
import { Pagination } from "@/ui/Pagination";
import { CheckCircle2, XCircle } from "lucide-react";

export default function CommissionReport() {
  const navigate = useNavigate();
  const { authorize, permissions, profile, hasAdminRole } = useProfile();
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | undefined>(dayjs());
  const [selectedSellerId, setSelectedSellerId] = useState<string | undefined>(
    undefined
  );
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const itemsPerCategoryPage = 5;

  const { performanceData, paginatedCategories, loading } = useCommissionReportData({
    selectedMonth,
    selectedSellerId,
    hasAdminRole,
    profileId: profile?._id,
    categoryPage: currentCategoryPage,
    categoryLimit: itemsPerCategoryPage,
  });

  const { sellers, loadingSellers } = useSellersList(hasAdminRole);
  const { clientCount, loadingClientCount } = useClients();

  useEffect(() => {
    if (!authorize("r_report_orders") && permissions.length) {
      navigate("/profile");
      redirectWarning();
    }
  }, [permissions, authorize, navigate]);

  const paginatedSalesByCategory = paginatedCategories.data;


  return (
    <div className="flex flex-col gap-6 py-sm px-sm sm:px-md bg-neutral-100 h-full overflow-y-auto">
      <div className="flex items-center gap-3">
        <IconButton
          size="large"
          iconColor="#71717A"
          onClick={() => navigate("/report")}
        >
          <ArrowBack />
        </IconButton>
        <div>
          <Caption variant="large" color="text-neutral-500">
            Relatório / Minhas Vendas
          </Caption>
        </div>
      </div>

      {loading ? (
        <SpinningLogo />
      ) : (
        <>
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
                    icon={<DollarSign className="size-7 text-success-600" />}
                    title="Total em Vendas"
                    value={formatCurrencyText(performanceData.totalSales.toFixed(2))}
                  />
                  <OverviewCard
                    className="px-4 max-h-28"
                    icon={<ShoppingCart className="size-7 text-blue-500" />}
                    title="Total de Pedidos"
                    value={performanceData.ordersCount}
                  />
                  <OverviewCard
                    className="px-4 max-h-28"
                    icon={<User className="size-7 text-neutral-500" />}
                    title="Clientes Cadastrados"
                    value={loadingClientCount ? "..." : clientCount}
                  />
                </Row>
              </Column>
            </Column>
          </Row>

          <div className="bg-white p-4 rounded-md shadow">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <BarChart2 size={24} className="text-neutral-700" />
                <Subtitle variant="large-semibold">Vendas por Vendedor</Subtitle>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <DatePicker
                  picker="month"
                  format="MM/YYYY"
                  value={selectedMonth}
                  onChange={(date) => setSelectedMonth(date || undefined)}
                  allowClear={true}
                  className="w-full sm:w-auto"
                />

                {hasAdminRole && (
                  <Select
                    placeholder="Selecionar Vendedor"
                    className="w-full sm:w-60"
                    allowClear
                    value={selectedSellerId}
                    onChange={(value) => setSelectedSellerId(value)}
                    options={[
                      { label: "Todos os Vendedores", value: undefined },
                      ...sellers.map((seller) => ({
                        label: seller.name,
                        value: seller.id,
                      })),
                    ]}
                    loading={loadingSellers}
                  />
                )}
              </div>
            </div>

            <div className="border border-neutral-200 rounded-md p-4 relative">
              <div className="flex items-center gap-3">
                <Column>
                  <Subtitle variant="medium">
                    {performanceData.sellerName}
                  </Subtitle>
                  <Paragraph variant="large" color="text-neutral-500">
                    {performanceData.sellerUsername}
                  </Paragraph>
                </Column>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <Paragraph variant="large" color="text-neutral-700">
                    {performanceData.ordersCount} pedidos
                  </Paragraph>
                </div>
              </div>

              <div className="flex justify-between items-start mt-6 pt-4 border-t border-neutral-200">
                <Column className="flex-1">
                  <Paragraph variant="large" color="text-neutral-500">
                    Total em Vendas
                  </Paragraph>
                  <Subtitle variant="large-semibold" color="text-success-600">
                    {formatCurrencyText(performanceData.totalSales.toFixed(2))}
                  </Subtitle>
                </Column>

                <Column className="flex-1">
                  <Paragraph variant="large" color="text-neutral-500">
                    Comissão Acumulada
                  </Paragraph>
                  <Subtitle variant="large-semibold" color="text-info-600">
                    {formatCurrencyText(performanceData.totalCommission.toFixed(2))}
                  </Subtitle>
                  {performanceData.isGoalAchieved ? (
                    <Paragraph
                      variant="large"
                      className="flex items-center gap-1 text-success-600"
                    >
                      <CheckCircle2 size={16} /> <span>Disponível para saque</span>
                    </Paragraph>
                  ) : (
                    <Paragraph
                      variant="large"
                      className="flex items-center gap-1 text-error-600"
                    >
                      <XCircle size={16} /> <span>Meta ainda não batida.</span>
                    </Paragraph>
                  )}
                </Column>

                <Column className="flex-1">
                  <Paragraph variant="large" color="text-neutral-500">
                    Status da Meta
                  </Paragraph>
                  {performanceData.isGoalAchieved ? (
                    <Subtitle variant="large-semibold" color="text-success-600">
                      Meta atingida!
                    </Subtitle>
                  ) : (
                    <>
                      <Subtitle variant="large-semibold" color="text-error-600">
                        Faltam{" "}
                        {formatCurrencyText(
                          performanceData.remainingToGoal.toFixed(2)
                        )}
                      </Subtitle>
                      <div className="w-full bg-neutral-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${performanceData.isGoalAchieved ? "bg-success-600" : "bg-error-600"
                            }`}
                          style={{
                            width: `${Math.min(100, (performanceData.totalSales / performanceData.monthlyGoal) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </>
                  )}
                </Column>
              </div>
            </div>
          </div>

          <div className="flex flex-col min-h-[50vh] gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
            <Column>
              <Row className="items-start">
                <Subtitle variant="large-semibold" color="text-neutral-800">
                  Vendas por Categoria
                </Subtitle>
              </Row>
            </Column>
            <>
              <Table
                data={paginatedSalesByCategory}
                headers={[
                  { label: "Categoria", key: "categoryName" },
                  { label: "Produtos", key: "productsCount" },
                  { label: "Total em Vendas", key: "totalSales" },
                  { label: "Comissão", key: "totalCategoryCommission" },
                ]}
                customMappings={{}}
                monetaryFields={["totalSales", "totalCategoryCommission"]}
              />
              <Pagination
                currentPage={paginatedCategories.currentPage}
                totalItems={paginatedCategories.totalItems}
                totalPages={paginatedCategories.totalPages}
                limit={paginatedCategories.itemsPerPage}
                handlePageClick={(page) => setCurrentCategoryPage(page)}
              />
            </>
          </div>
        </>
      )}
    </div>
  );
}