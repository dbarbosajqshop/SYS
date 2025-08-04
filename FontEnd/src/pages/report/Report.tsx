import { Heading } from "@/ui/typography/Heading";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useProfile } from "@/hooks/useProfile";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { redirectWarning } from "@/helpers/messagesWarnings";
import { ReportCard } from "../../components/ReportCard";
import {
  Package,
  Receipt,
  TrendingUp,
  DollarSign,
  Box,
  ShoppingCart,
  LineChart,
  CreditCard,
  Tag,
  Warehouse,
  Truck,
  ClipboardList,
  BarChart2,
  AlertTriangle,
  FileText,
  Users,
  MinusCircle,
  PiggyBank,
  ArrowDownCircle,
  CalendarDays,
  Calendar,
} from "lucide-react";

export default function Report() {
  const navigate = useNavigate();
  const { authorize, permissions } = useProfile();

  useEffect(() => {
    if (!authorize("sidebar_report") && permissions.length) {
      navigate("/profile");
      redirectWarning();
    }
  }, [permissions, authorize, navigate]);

  const reportCategories = [
    {
      title: "Venda / Financeiro",
      colorClass: "bg-green-500",
      reports: [
        {
          title: "Vendas Diárias",
          description: "Visualização das vendas por dia.",
          path: "/report/daily-sales",
          permission: "r_report_daily_sales",
          icon: <CalendarDays size={24} />,
        },
        {
          title: "Vendas Diárias (Novo)",
          description: "Visualização das vendas por dia - nova rota.",
          path: "/report/daily-report",
          permission: "r_report_orders",
          icon: <CalendarDays size={24} />,
        },
        {
          title: "Vendas Mensais",
          description: "Visualização das vendas por mês.",
          path: "/report/monthly-sales",
          permission: "r_report_monthly_sales",
          icon: <Calendar size={24} />,
        },
        {
          title: "Vendas Mensais (Novo)",
          description: "Visualização das vendas por mês - nova rota.",
          path: "/report/monthly-report",
          permission: "r_report_orders",
          icon: <Calendar size={24} />,
        },
        {
          title: "Relatório de Vendas",
          description: "Visualize todas as vendas realizadas no sistema.",
          path: "/report/orders",
          permission: "r_report_orders",
          icon: <Receipt size={24} />,
        },
        {
          title: "Relatórios de Pagtos.",
          description: "Detalhes sobre os pagamentos recebidos.",
          path: "/report/payments",
          permission: "r_report_payments",
          icon: <CreditCard size={24} />,
        },
        {
          title: "Vendas Detalhado",
          description: "Relatório detalhado de cada venda.",
          path: "/report/detailed-sales",
          permission: "r_report_detailed_sales",
          icon: <LineChart size={24} />,
        },
        {
          title: "Pagamento Detalhado",
          description: "Relatório detalhado de cada pagamento.",
          path: "/report/detailed-payments",
          permission: "r_report_detailed_payments",
          icon: <CreditCard size={24} />,
        },
        {
          title: "Venda Negativa",
          description: "Visualiza vendas com valores negativos.",
          path: "/report/negative-sales",
          permission: "r_report_negative_sales",
          icon: <MinusCircle size={24} />,
        },
        {
          title: "Resumo Caixa",
          description: "Resumo diário do caixa.",
          path: "/report/cash-summary",
          permission: "r_report_cash_summary",
          icon: <PiggyBank size={24} />,
        },
        {
          title: "Vendedores",
          description: "Desempenho de vendas por vendedor.",
          path: "/report/sellers",
          permission: "r_report_sellers",
          icon: <Users size={24} />,
        },
        {
          title: "Caixa Negativo",
          description: "Identifica caixas com saldo negativo.",
          path: "/report/negative-cash",
          permission: "r_report_negative_cash",
          icon: <ArrowDownCircle size={24} />,
        },
        {
          title: "Caixa Fiscal",
          description: "Relatório de caixa para fins fiscais.",
          path: "/report/fiscal-cash",
          permission: "r_report_fiscal_cash",
          icon: <FileText size={24} />,
        },
        {
          title: "Devolução",
          description: "Registros de devoluções de produtos.",
          path: "/report/returns",
          permission: "r_report_returns",
          icon: <ArrowDownCircle size={24} />,
        },
        {
          title: "Itens Vendidos",
          description: "Detalhes sobre a quantidade de cada item vendido.",
          path: "/report/sold",
          permission: "r_report_orders",
          icon: <TrendingUp size={24} />,
        },
        {
          title: "Custo por Item",
          description: "Análise dos custos e lucros por item.",
          path: "/report/cost",
          permission: "r_report_orders",
          icon: <DollarSign size={24} />,
        },
        {
          title: "Minhas Vendas",
          description: "Análise de comissão e vendas.",
          path: "/report/commission-seller",
          permission: "r_report_orders",
          icon: <ShoppingCart size={24} />,
        },
      ],
    },
    {
      title: "Produtos",
      colorClass: "bg-blue-500",
      reports: [
        {
          title: "Gráf. do Estoque do Dep.",
          description: "Gráfico do estoque do depósito.",
          path: "/report/warehouse-stock-graph",
          permission: "r_report_warehouse_stock_graph",
          icon: <BarChart2 size={24} />,
        },
        {
          title: "Alerta de Estoque",
          description: "Produtos com estoque baixo ou crítico.",
          path: "/report/stock-alert",
          permission: "r_report_stock_alert",
          icon: <AlertTriangle size={24} />,
        },
        {
          title: "Alerta de Validade",
          description: "Produtos próximos da data de validade.",
          path: "/report/expiration-alert",
          permission: "r_report_expiration_alert",
          icon: <AlertTriangle size={24} />,
        },
        {
          title: "Relatório de Produtos",
          description: "Listagem completa de todos os produtos.",
          path: "/report/items",
          permission: "r_report_items",
          icon: <Package size={24} />,
        },
        {
          title: "Categorias",
          description: "Relatório de produtos por categoria.",
          path: "/report/categories",
          permission: "r_report_categories",
          icon: <Tag size={24} />,
        },
        {
          title: "Ncm",
          description: "Itens agrupados por NCM.",
          path: "/report/ncm",
          permission: "r_report_orders",
          icon: <Box size={24} />,
        },
        {
          title: "Estoque Lojas",
          description: "Estoque de produtos em cada loja.",
          path: "/report/store-stock",
          permission: "r_report_store_stock",
          icon: <Warehouse size={24} />,
        },
        {
          title: "Produto Fornecedor",
          description: "Produtos relacionados aos seus fornecedores.",
          path: "/report/product-supplier",
          permission: "r_report_product_supplier",
          icon: <Truck size={24} />,
        },
        {
          title: "Estoque Geral",
          description: "Visão geral do estoque total.",
          path: "/report/general-stock",
          permission: "r_report_general_stock",
          icon: <Warehouse size={24} />,
        },
        {
          title: "Balanço",
          description: "Relatório de balanço de produtos.",
          path: "/report/balance",
          permission: "r_report_balance",
          icon: <ClipboardList size={24} />,
        },
        {
          title: "Balanço Detalhado",
          description: "Balanço detalhado por produto.",
          path: "/report/detailed-balance",
          permission: "r_report_detailed_balance",
          icon: <ClipboardList size={24} />,
        },
        {
          title: "Produto Balançado",
          description: "Itens que foram balançados no sistema.",
          path: "/report/balanced-product",
          permission: "r_report_balanced_product",
          icon: <ClipboardList size={24} />,
        },
      ],
    },
    {
      title: "Compras",
      colorClass: "bg-red-500",
      reports: [
        {
          title: "Relatório de Compras",
          description: "Visualize todas as compras realizadas.",
          path: "/report/purchases",
          permission: "r_report_purchases",
          icon: <ShoppingCart size={24} />,
        },
        {
          title: "Relatório de Fornecedores",
          description: "Compras por fornecedor.",
          path: "/report/supplier-purchases",
          permission: "r_report_supplier_purchases",
          icon: <Truck size={24} />,
        },
        {
          title: "Compras Diárias",
          description: "Compras realizadas diariamente.",
          path: "/report/daily-purchases",
          permission: "r_report_daily_purchases",
          icon: <CalendarDays size={24} />,
        },
        {
          title: "Compras Mensais",
          description: "Compras realizadas mensalmente.",
          path: "/report/monthly-purchases",
          permission: "r_report_monthly_purchases",
          icon: <Calendar size={24} />,
        },
        {
          title: "Compras Detalhado",
          description: "Detalhes de cada compra realizada.",
          path: "/report/detailed-purchases",
          permission: "r_report_detailed_purchases",
          icon: <ShoppingCart size={24} />,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-sm px-sm sm:px-md bg-neutral-100 h-full overflow-y-auto">
      <div>
        <Heading variant="medium">Relatórios</Heading>
        <Subtitle variant="small" color="text-neutral-500">
          Acompanhe suas métricas e dados detalhados
        </Subtitle>
      </div>

      {reportCategories.map((category, catIndex) => (
        <div key={catIndex} className="mb-8">
          <div className={`py-2 px-4 rounded-t-md ${category.colorClass}`}>
            <Subtitle variant="large-semibold" color="text-neutral-0">
              {category.title}
            </Subtitle>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 bg-neutral-0 border border-t-0 border-neutral-200 rounded-b-md">
            {category.reports.map((report, repIndex) =>
              authorize(report.permission) ? (
                <ReportCard
                  key={repIndex}
                  title={report.title}
                  description={report.description}
                  to={report.path}
                  icon={report.icon}
                />
              ) : null
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
