import { Search } from "@/icons/Search";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState, useEffect, useMemo } from "react";
import { Table } from "@/ui/Table";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { useItemMovementAuditLogs } from "@/hooks/useItemMovementAuditLogs";
import { IGetAuditLogItemMovement } from "@/types/auditLogs";
import { Filter } from "@/icons/Filter";
import { Caption } from "@/ui/typography/Caption";
import { Button } from "@/ui/Button";
import { FilterOptions } from "@/components/FilterOptions";
import { ITEM_MOVEMENT_LOG_FILTER_OPTIONS } from "@/constants";
import { TraceabilityTabs } from "./TraceabilityTabs";
import { LogChangesModal } from "@/components/LogChangesModal";
import { IconButton } from "@/ui/IconButton";
import { Dots } from "@/icons/Dots";
import { useQuery } from "@tanstack/react-query";
import { OverviewCard } from "@/components/OverviewCard";
import { Truck, ArrowDownCircle, ArrowUpCircle, Repeat, Scale } from "lucide-react";
import { getItemMovementAuditMetrics } from "@/services/itemMovementAuditMetrics";

export default function ItemMovementLogs() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [dSearch] = useDebounce(search, 500);
  const { logs, loading, fetchLogs } = useItemMovementAuditLogs();
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState<IGetAuditLogItemMovement | null>(null);
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
      params.search = dSearch;
    }
    return params;
  }, [selectedFilter, dSearch]);

  const { data: itemMovementMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["itemMovementAuditMetrics", metricsQueryParams],
    queryFn: () => getItemMovementAuditMetrics(metricsQueryParams),
  });

  useEffect(() => {
    fetchLogs(metricsQueryParams);
  }, [metricsQueryParams, fetchLogs]);

  const handlePageClick = (page: number) => {
    const params: { [key: string]: string | number | undefined } = { page };

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
      params.search = dSearch;
    }

    fetchLogs(params);
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleSelectFilter = (filter: string) => {
    setSelectedFilter(filter);
    setSearch("");
  };

  const getPlaceholder = () => {
    const option = ITEM_MOVEMENT_LOG_FILTER_OPTIONS.find(opt => opt.value === selectedFilter);
    if (option) {
      if (option.value === "startDate" || option.value === "endDate") {
        return `Selecione a ${option.label.toLowerCase()}`;
      }
      return `Buscar por ${option.label.toLowerCase().replace('(id)', 'ID')}`;
    }
    return 'Buscar termo geral...';
  };

  const getInputType = () => {
    if (selectedFilter === "startDate" || selectedFilter === "endDate") {
      return "date";
    }
    return "text";
  };

  const handleViewChanges = (log: IGetAuditLogItemMovement) => {
    setSelectedLogDetails(log);
    setIsChangesModalOpen(true);
  };

  const resolveUserIdDisplay = (
    userIdValue: unknown,
    _row: IGetAuditLogItemMovement
  ): string => {
    void _row; 
    if (typeof userIdValue === 'object' && userIdValue !== null) {
      const userObj = userIdValue as { _id: string; name?: string; email?: string };
      return userObj.name || userObj.email || (userObj._id ? userObj._id.substring(0, 8) + '...' : 'N/A');
    }
    if (typeof userIdValue === 'string') {
      if (userIdValue.length === 24 && userIdValue.match(/^[0-9a-fA-F]{24}$/)) {
        return userIdValue.substring(0, 8) + '...';
      }
      return userIdValue;
    }
    return String(userIdValue || 'N/A');
  };

  const resolveItemIdDisplay = (itemIdValue: unknown, row: IGetAuditLogItemMovement): string => {
    if (row.itemName) { 
      return row.itemName;
    }
    if (typeof itemIdValue === 'object' && itemIdValue !== null) {
      const itemObj = itemIdValue as { _id: string; name?: string; sku?: string };
      return itemObj.name || itemObj.sku || (itemObj._id ? itemObj._id.substring(0, 8) + '...' : 'N/A');
    }
    if (typeof itemIdValue === 'string') {
      if (itemIdValue.length === 24 && itemIdValue.match(/^[0-9a-fA-F]{24}$/)) {
        return itemIdValue.substring(0, 8) + '...';
      }
      return itemIdValue;
    }
    return String(itemIdValue || 'N/A');
  };

  const resolveLocationDisplay = (locationName: string | undefined | null, locationIdValue: unknown): string => {
    if (locationName) {
      return locationName;
    }
    if (typeof locationIdValue === 'string' && locationIdValue.length === 24 && locationIdValue.match(/^[0-9a-fA-F]{24}$/)) {
      return locationIdValue.substring(0, 8) + '...';
    }
    return String(locationIdValue || 'N/A');
  };


  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      <LogChangesModal
        open={isChangesModalOpen}
        setOpen={setIsChangesModalOpen}
        logDetails={selectedLogDetails ? {
          action: selectedLogDetails.action,
          userId: selectedLogDetails.userId,
          targetId: selectedLogDetails.itemId, 
          targetType: selectedLogDetails.targetType,
          targetName: selectedLogDetails.itemName, 
          timestamp: selectedLogDetails.createdAt,
          createdAt: selectedLogDetails.createdAt,
          changes: selectedLogDetails.changes || [],
        } : null}
      />

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Registros de Movimentação de Itens</Subtitle>
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
              {ITEM_MOVEMENT_LOG_FILTER_OPTIONS.find((option) => option.value === selectedFilter)
                ?.label || "Filtrar"}
            </Caption>
          </Button>

          {showFilters && (
            <FilterOptions
              selectedFilter={selectedFilter}
              onClose={toggleFilters}
              onSelectFilter={handleSelectFilter}
              filterOptions={ITEM_MOVEMENT_LOG_FILTER_OPTIONS}
            />
          )}
        </div>
      </div>

      {isLoadingMetrics ? (
        <SpinningLogo />
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <OverviewCard
            icon={<Truck className="size-7" />}
            title="Total de Movimentações"
            value={itemMovementMetrics?.totalMovementLogs || 0}
          />
          <OverviewCard
            icon={<ArrowDownCircle className="size-7" />}
            title="Qtd. Entradas"
            value={itemMovementMetrics?.totalInboundQuantityLastMonth || 0}
          />
          <OverviewCard
            icon={<ArrowUpCircle className="size-7" />}
            title="Qtd. Saídas"
            value={itemMovementMetrics?.totalOutboundQuantityLastMonth || 0}
          />
          <OverviewCard
            icon={<Repeat className="size-7" />}
            title="Transferências"
            value={itemMovementMetrics?.totalTransfersMonth || 0}
          />
          <OverviewCard
            icon={<Scale className="size-7" />}
            title="Qtd. Ajustes Totais"
            value={itemMovementMetrics?.totalAdjustmentsQuantity || 0}
          />
        </div>
      )}

      <TraceabilityTabs />

      {loading ? (
        <SpinningLogo />
      ) : (
        <Table
          data={logs?.data || []} 
          headers={[
            { label: "Ação", key: "action" }, 
            {
              label: "Usuário",
              key: "userId",
              render: (userIdValue: unknown, row: IGetAuditLogItemMovement) => resolveUserIdDisplay(userIdValue, row)
            },
            {
              label: "Item",
              key: "itemId", 
              cellClassName: "max-w-[250px] break-words",
              render: (itemIdValue: unknown, row: IGetAuditLogItemMovement) => resolveItemIdDisplay(itemIdValue, row)
            },
            { label: "Quantidade", key: "quantity" },
            {
              label: "De",
              key: "fromLocationId", 
              cellClassName: "max-w-[200px] break-words",
              render: (fromLocationIdValue: unknown, row: IGetAuditLogItemMovement) => resolveLocationDisplay(row.fromLocationName, fromLocationIdValue)
            },
            {
              label: "Para",
              key: "toLocationId",
              cellClassName: "max-w-[200px] break-words",
              render: (toLocationIdValue: unknown, row: IGetAuditLogItemMovement) => resolveLocationDisplay(row.toLocationName, toLocationIdValue)
            },
            { label: "Data/Hora", key: "createdAt" }, 
            {
              label: "Detalhes",
              key: "changes",
              cellClassName: "w-10 text-center",
              render: (_changesValue: unknown, row: IGetAuditLogItemMovement) => (
                <IconButton size="large" onClick={() => handleViewChanges(row)}>
                  <Dots />
                </IconButton>
              )
            },
          ]}
          actionButton={false} 
          customMappings={{
            action: { CREATE: "Criação", UPDATE: "Atualização", DELETE: "Exclusão", ITEM_INBOUND: "Entrada de Item", ITEM_OUTBOUND: "Saída de Item", ITEM_TRANSFER: "Transferência de Item", ITEM_INITIAL_STOCK: "Estoque Inicial", ITEM_ADJUSTMENT: "Ajuste de Estoque" },
            targetType: {
              ItemMovement: "Movimentação de Item", 
              Item: "Item", 
              Stock: "Estoque", 
              Street: "Rua",
              Build: "Prédio",
              Floor: "Andar",
            },
          }}
          dateFields={["createdAt"]} 
        />
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