import { Search } from "@/icons/Search";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState, useEffect, useMemo, useCallback } from "react"; 
import { Table } from "@/ui/Table";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { useOrderAuditLogs } from "@/hooks/useOrderAuditLogs";
import { IGetAuditLogOrder } from "@/types/auditLogs";
import { Filter } from "@/icons/Filter";
import { Caption } from "@/ui/typography/Caption";
import { Button } from "@/ui/Button";
import { FilterOptions } from "@/components/FilterOptions";
import { ORDER_LOG_FILTER_OPTIONS } from "@/constants";
import { TraceabilityTabs } from "./TraceabilityTabs";
import { StatusBadge } from "@/components/StatusBadge";
import { LogChangesModal } from "@/components/LogChangesModal";
import { IconButton } from "@/ui/IconButton";
import { Dots } from "@/icons/Dots";
import { useQuery } from "@tanstack/react-query";
import { OverviewCard } from "@/components/OverviewCard";
import { PlusCircle, DollarSign, Clock, CheckCircle } from "lucide-react";
import { getOrderAuditMetrics } from "@/services/orderAuditMetrics";
import { formatCurrencyText } from "@/helpers";
import { ReactNode } from "react";

export default function OrderLogs() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [dSearch] = useDebounce(search, 500);
  const { logs, loading, fetchLogs } = useOrderAuditLogs();
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState<IGetAuditLogOrder | null>(null);

  const metricsQueryParams = useMemo(() => {
    const params: { [key: string]: string | undefined } = {};
    if (selectedFilter && selectedFilter !== "") {
      if (selectedFilter === "startDate" && dSearch) {
        params.startDate = new Date(dSearch).toISOString();
      } else if (selectedFilter === "endDate" && dSearch) {
        const endDate = new Date(dSearch);
        endDate.setHours(23, 59, 59, 999);
        params.endDate = endDate.toISOString();
      } else {
        params[selectedFilter] = dSearch;
      }
    } else if (dSearch) {
      const isOrderNumber = /^\d+$/.test(dSearch);
      if (isOrderNumber) {
        params.param = "orderNumber";
      } else {
        params.param = "search";
      }
      params.search = dSearch;
    }
    return params;
  }, [selectedFilter, dSearch]);

  const { data: orderMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["orderAuditMetrics", metricsQueryParams],
    queryFn: () => getOrderAuditMetrics(metricsQueryParams),
  });

  useEffect(() => {
    fetchLogs(metricsQueryParams);
  }, [metricsQueryParams, fetchLogs]);

  const getFetchParams = useCallback((page?: number) => {
    const params: { [key: string]: string | number | undefined } = { page: page || 1 };
    if (selectedFilter && selectedFilter !== "") {
      if (selectedFilter === "startDate" && search) {
        params.startDate = new Date(search).toISOString();
      } else if (selectedFilter === "endDate" && search) {
        const endDate = new Date(search);
        endDate.setHours(23, 59, 59, 999);
        params.endDate = endDate.toISOString();
      } else {
        params[selectedFilter] = search;
      }
    } else if (search) {
      const isOrderNumber = /^\d+$/.test(search);
      if (isOrderNumber) {
        params.param = "orderNumber";
      } else {
        params.param = "search";
      }
      params.search = search;
    }
    return params;
  }, [selectedFilter, search]);

  const handlePageClick = (page: number) => {
    fetchLogs(getFetchParams(page));
  };

  const toggleFilters = () => setShowFilters(!showFilters);
  const handleSelectFilter = (filter: string) => {
    setSelectedFilter(filter);
    setSearch(""); 
  };

  const getPlaceholder = () => {
    const option = ORDER_LOG_FILTER_OPTIONS.find(opt => opt.value === selectedFilter);
    if (option && option.value !== "") {
      if (option.value === "status") {
        return `Filtrar por status (Ex: pendente, entregue)`;
      }
      return `Buscar por ${option.label.toLowerCase().replace('(id)', 'ID')}`;
    }
    return 'Buscar termo geral...';
  };

  const getInputType = (): "text" | "password" | "number" | "date" => {
    if (selectedFilter === "startDate" || selectedFilter === "endDate") {
      return "date";
    }
    return "text";
  };

  const orderStatusMap: Record<string, string> = {
    pendente: "Pendente",
    separacao: "Em Separação",
    conferencia: "Em Conferência",
    docas: "Nas Docas",
    em_transito: "Em Trânsito",
    entregue: "Entregue",
    cancelado: "Cancelado",
    em_pagamento: "Em Pagamento",
  };

  const formatOrderStatusText = (status: string | undefined): string => { 
    return status ? orderStatusMap[status] || status.replace(/_/g, " ") : 'Excluido';
  };

  const handleViewChanges = (log: IGetAuditLogOrder) => {
    setSelectedLogDetails(log);
    setIsChangesModalOpen(true);
  };

  const resolveUserIdDisplay = (value: unknown, _row: IGetAuditLogOrder): ReactNode => {
    void _row; 
    if (typeof value === 'object' && value !== null && '_id' in value) {
      const userObj = value as { _id: string; name?: string; email?: string };
      return userObj.name || userObj.email || (userObj._id ? userObj._id.substring(0, 8) + '...' : 'N/A');
    }
    if (typeof value === 'string') {
      if (value.length === 24 && value.match(/^[0-9a-fA-F]{24}$/)) {
        return value.substring(0, 8) + '...';
      }
      return value;
    }
    return String(value || 'N/A');
  };

  const resolveClientIdDisplay = (value: unknown, _row: IGetAuditLogOrder): ReactNode => {
    void _row; 
    if (typeof value === 'object' && value !== null && '_id' in value) {
      const clientObj = value as { _id: string; name?: string; email?: string };
      return clientObj.name || clientObj.email || (clientObj._id ? clientObj._id.substring(0, 8) + '...' : 'Cliente não especificado');
    }
    if (typeof value === 'string') {
      if (value.length === 24 && value.match(/^[0-9a-fA-F]{24}$/)) {
        return value.substring(0, 8) + '...';
      }
      return value;
    }
    return String(value || 'Cliente não especificado');
  };

  const resolveOrderIdentifierDisplay = (value: unknown, row: IGetAuditLogOrder): ReactNode => {
    if (row.targetName) {
      return row.targetName;
    }
    if (row.metadata?.orderNumber) {
      return `Pedido #${row.metadata.orderNumber}`;
    }
    if (typeof value === 'object' && value !== null && '_id' in value) {
      const orderObj = value as { _id: string; orderNumber?: string };
      return orderObj.orderNumber ? `Pedido #${orderObj.orderNumber}` : (orderObj._id ? orderObj._id.substring(0, 8) + '...' : 'N/A');
    }
    if (typeof value === 'string') {
      if (value.length === 24 && value.match(/^[0-9a-fA-F]{24}$/)) {
        return value.substring(0, 8) + '...';
      }
      return value;
    }
    return String(value || 'N/A');
  };

  const formatActionForDisplay = (value: unknown): ReactNode => { 
    const actionValue = typeof value === 'string' ? value : String(value); 
    switch (actionValue) {
      case 'CREATE': return 'Criação';
      case 'UPDATE': return 'Atualização';
      case 'DELETE': return 'Exclusão';
      case 'INACTIVATE': return 'Exclusão';
      case 'STATUS_CHANGE': return 'Mudança de Status';
      case 'PAYMENT_UPDATE': return 'Atualização de Pagamento';
      case 'ITEM_UPDATE': return 'Atualização de Itens';
      default: return actionValue;
    }
  };

  const formatDateToDDMMYYYY = (value: unknown): ReactNode => { 
    if (typeof value !== 'string' || !value) return "N/A";
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return "Data Inválida";
    }
    return date.toLocaleDateString("pt-BR");
  };

  const formatTotalValueDisplay = (value: unknown): ReactNode => { 
    const numericValue = Number(value || 0);
    return formatCurrencyText(numericValue.toFixed(2));
  };

  const formatLocalDisplay = (value: unknown): ReactNode => { 
    const localValue = typeof value === 'string' ? value : String(value);
    switch (localValue) {
      case 'online': return 'Online';
      case 'presencial': return 'Presencial';
      default: return localValue;
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      <LogChangesModal
        open={isChangesModalOpen}
        setOpen={setIsChangesModalOpen}
        logDetails={selectedLogDetails ? {
          action: selectedLogDetails.action,
          userId: selectedLogDetails.userId,
          targetId: selectedLogDetails.targetId,
          targetType: selectedLogDetails.targetType,
          targetName: selectedLogDetails.targetName,
          timestamp: selectedLogDetails.createdAt || selectedLogDetails.timestamp,
          createdAt: selectedLogDetails.createdAt,
          changes: selectedLogDetails.changes,
        } : null}
      />

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Registros de Pedidos</Subtitle>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-0 sm:gap-6 relative">
          <Input
            data={search}
            onChange={({ target }) => setSearch(target.value)}
            icon={<Search />}
            iconPosition="left"
            wide
            className="bg-neutral-0 -my-2.5 w-full"
            placeholder={getPlaceholder()}
            type={getInputType()}
          />
          <Button
            variant="naked"
            color="default"
            className="border"
            onClick={toggleFilters}
          >
            <Filter />{" "}
            <Caption variant="large">
              {ORDER_LOG_FILTER_OPTIONS.find((option) => option.value === selectedFilter)
                ?.label || "Filtrar"}
            </Caption>
          </Button>

          {showFilters && (
            <FilterOptions
              selectedFilter={selectedFilter}
              onClose={toggleFilters}
              onSelectFilter={handleSelectFilter}
              filterOptions={ORDER_LOG_FILTER_OPTIONS}
            >
            </FilterOptions>
          )}
        </div>
      </div>

      {isLoadingMetrics ? (
        <SpinningLogo />
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <OverviewCard
            icon={<PlusCircle className="size-7" />}
            title="Novos Pedidos"
            value={orderMetrics?.newOrderCreatesMonth || 0}
          />
          <OverviewCard
            icon={<DollarSign className="size-7" />}
            title="Valor Total Pedidos"
            value={formatCurrencyText(String(orderMetrics?.totalValueLastMonth?.toFixed(2) || 0))}
          />
          <OverviewCard
            icon={<Clock className="size-7" />}
            title="Pedidos Pendentes"
            value={orderMetrics?.pendingOrdersCount || 0}
          />
          <OverviewCard
            icon={<CheckCircle className="size-7" />}
            title="Pedidos Entregues"
            value={orderMetrics?.deliveredOrdersCount || 0}
          />
        </div>
      )}

      <TraceabilityTabs />

      {loading ? (
        <SpinningLogo />
      ) : logs?.data && logs.data.length > 0 ? (
        <>
          <Table
            data={logs.data}
            headers={[
              { label: "Ação", key: "action", render: (value) => formatActionForDisplay(value) },
              {
                label: "Usuário",
                key: "userId",
                render: (value, row: IGetAuditLogOrder) => resolveUserIdDisplay(value, row)
              },
              {
                label: "Pedido",
                key: "targetId",
                cellClassName: "max-w-[150px] break-words",
                render: (value, row: IGetAuditLogOrder) => resolveOrderIdentifierDisplay(value, row)
              },
              {
                label: "Cliente",
                key: "clientId",
                cellClassName: "max-w-[150px] break-words",
                render: (value, row: IGetAuditLogOrder) => resolveClientIdDisplay(value, row)
              },
              {
                label: "Status",
                key: "status",
                render: (value: unknown): ReactNode => {
                  const statusValue = typeof value === 'string' ? value : undefined;
                  return <StatusBadge status={statusValue} displayText={formatOrderStatusText(statusValue)} />;
                }
              },
              { label: "Valor Total", key: "metadata.totalValue", render: (value) => formatTotalValueDisplay(value) },
              { label: "Itens", key: "metadata.itemsCount" },
              { label: "Local", key: "metadata.local", render: (value) => formatLocalDisplay(value) },
              { label: "Data/Hora", key: "createdAt", render: (value) => formatDateToDDMMYYYY(value) },
              {
                label: "Detalhes",
                key: "changes", 
                cellClassName: "w-10 text-center",
                render: (_changesValue: unknown, row: IGetAuditLogOrder) => (
                  <IconButton size="large" onClick={() => handleViewChanges(row)}>
                    <Dots />
                  </IconButton>
                )
              },
            ]}
            actionButton={false}
            customMappings={{
              action: { CREATE: "Criação", UPDATE: "Atualização", DELETE: "Exclusão", STATUS_CHANGE: "Mudança de Status", PAYMENT_UPDATE: "Atualização de Pagamento", ITEM_UPDATE: "Atualização de Itens do Pedido" },
              targetType: {
                Order: "Pedido",
              },
              status: {
                pendente: "Pendente", separacao: "Em Separação", conferencia: "Em Conferência", docas: "Nas Docas",
                em_transito: "Em Trânsito", entregue: "Entregue", cancelado: "Cancelado", em_pagamento: "Em Pagamento",
              },
              local: { 
                online: "Online", presencial: "Presencial"
              }
            }}
            dateFields={["createdAt"]}
            monetaryFields={["metadata.totalValue"]}
          />
        </>
      ) : (
        <div className="flex justify-center items-center py-4">
          <Subtitle variant="large" color="text-neutral-500">Nenhum registro de pedido encontrado.</Subtitle>
        </div>
      )}
      {!loading && logs?.data && logs.data.length > 0 && (
        <Pagination
          currentPage={logs.pagination.page}
          totalItems={logs.pagination.total}
          totalPages={logs.pagination.totalPages}
          limit={logs.pagination.limit}
          handlePageClick={handlePageClick}
        />
      )}
    </div>
  );
}