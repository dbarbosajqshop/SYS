import { Search } from "@/icons/Search";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Table } from "@/ui/Table";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { useStockAuditLogs } from "@/hooks/useStockAuditLogs";
import { IGetAuditLogStock } from "@/types/auditLogs";
import { Filter } from "@/icons/Filter";
import { Caption } from "@/ui/typography/Caption";
import { Button } from "@/ui/Button";
import { FilterOptions } from "@/components/FilterOptions";
import { STOCK_LOG_FILTER_OPTIONS } from "@/constants";
import { TraceabilityTabs } from "./TraceabilityTabs";
import { LogChangesModal } from "@/components/LogChangesModal";
import { IconButton } from "@/ui/IconButton";
import { Dots } from "@/icons/Dots";
import { useQuery } from "@tanstack/react-query";
import { OverviewCard } from "@/components/OverviewCard";
import { LayoutGrid, Home, Package } from "lucide-react";
import { getStockAuditMetrics } from "@/services/stockAuditMetrics";
import { ReactNode } from "react";

export default function StockLogs() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [hierarchyLevelFilter, setHierarchyLevelFilter] = useState("");
  const [includeHierarchyFilter, setIncludeHierarchyFilter] = useState(false);
  const [dSearch] = useDebounce(search, 500);
  const { logs, loading, fetchLogs } = useStockAuditLogs();
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState<IGetAuditLogStock | null>(
    null
  );

  const metricsQueryParams = useMemo(() => {
    const params: { [key: string]: string | boolean | undefined } = {};
    if (selectedFilter && selectedFilter !== "") {
      params[selectedFilter] = dSearch;
    } else {
      params.search = dSearch;
    }
    if (hierarchyLevelFilter) params.hierarchyLevel = hierarchyLevelFilter;
    if (includeHierarchyFilter) params.includeHierarchy = includeHierarchyFilter;
    return params;
  }, [selectedFilter, dSearch, hierarchyLevelFilter, includeHierarchyFilter]);

  const { data: stockMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["stockAuditMetrics", metricsQueryParams],
    queryFn: () => getStockAuditMetrics(metricsQueryParams),
  });

  useEffect(() => {
    fetchLogs(metricsQueryParams);
  }, [metricsQueryParams, fetchLogs]);

  const handlePageClick = useCallback(
    (page: number) => {
      const params: { [key: string]: string | number | boolean | undefined } = { page };
      if (selectedFilter && selectedFilter !== "") {
        params[selectedFilter] = dSearch;
      } else {
        params.search = dSearch;
      }
      if (hierarchyLevelFilter) params.hierarchyLevel = hierarchyLevelFilter;
      if (includeHierarchyFilter) params.includeHierarchy = includeHierarchyFilter;

      fetchLogs(params);
    },
    [selectedFilter, dSearch, hierarchyLevelFilter, includeHierarchyFilter, fetchLogs]
  );

  const toggleFilters = () => setShowFilters(!showFilters);
  const handleSelectFilter = (filter: string) => {
    setSelectedFilter(filter);
    setSearch("");
  };

  const getPlaceholder = () => {
    const option = STOCK_LOG_FILTER_OPTIONS.find((opt) => opt.value === selectedFilter);
    if (option && option.value !== "") {
      return `Buscar por ${option.label.toLowerCase().replace("(id)", "ID")}`;
    }
    return "Buscar termo geral...";
  };

  const resolveUserIdDisplay = (
    userIdValue: unknown,
    _row: IGetAuditLogStock
  ): ReactNode => {
    void _row;
    if (typeof userIdValue === "object" && userIdValue !== null && "_id" in userIdValue) {
      const userObj = userIdValue as { _id: string; name?: string; email?: string };
      return (
        userObj.name ||
        userObj.email ||
        (userObj._id ? userObj._id.substring(0, 8) + "..." : "N/A")
      );
    }
    if (typeof userIdValue === "string") {
      if (userIdValue.length === 24 && userIdValue.match(/^[0-9a-fA-F]{24}$/)) {
        return userIdValue.substring(0, 8) + "...";
      }
      return userIdValue;
    }
    return String(userIdValue || "N/A");
  };

  const resolveTargetIdDisplay = (
    targetIdValue: unknown,
    row: IGetAuditLogStock
  ): ReactNode => {
    if (row.stockName) {
      return row.stockName;
    }
    if (
      typeof targetIdValue === "object" &&
      targetIdValue !== null &&
      "_id" in targetIdValue
    ) {
      const targetObj = targetIdValue as { _id: string; name?: string; code?: string };
      return (
        targetObj.name ||
        targetObj.code ||
        (targetObj._id ? targetObj._id.substring(0, 8) + "..." : "N/A")
      );
    }
    if (typeof targetIdValue === "string") {
      if (targetIdValue.length === 24 && targetIdValue.match(/^[0-9a-fA-F]{24}$/)) {
        return targetIdValue.substring(0, 8) + "...";
      }
      return targetIdValue;
    }
    return String(targetIdValue || "N/A");
  };

  const formatActionForDisplay = (value: unknown): ReactNode => {
    const actionValue = typeof value === "string" ? value : String(value);
    switch (actionValue) {
      case "CREATE":
        return "Criação";
      case "UPDATE":
        return "Atualização";
      case "DELETE":
        return "Exclusão";
      case "INACTIVATE":
        return "Inativação";
      case "REACTIVATE":
        return "Reativação";
      case "INACTIVATE_HIERARCHY":
        return "Inativação de Hierarquia";
      default:
        return actionValue;
    }
  };

  const formatDateToDDMMYYYY = (value: unknown): ReactNode => {
    if (typeof value !== "string" || !value) return "N/A";
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return "Data Inválida";
    }
    return date.toLocaleDateString("pt-BR");
  };

  const formatTargetModelDisplay = (value: unknown): ReactNode => {
    const modelValue = typeof value === "string" ? value : String(value);
    switch (modelValue) {
      case "Stock":
        return "Estoque";
      case "Street":
        return "Rua";
      case "Build":
        return "Prédio";
      case "Floor":
        return "Andar";
      default:
        return modelValue;
    }
  };

  const formatHierarchyPathDisplay = (
    _value: unknown,
    log: IGetAuditLogStock
  ): ReactNode => {

    const pathParts = [];
    if (typeof log.hierarchy?.floorId === "object" && log.hierarchy.floorId !== null)
      pathParts.push(log.hierarchy.floorId.name || log.hierarchy.floorId.code);
    if (typeof log.hierarchy?.buildId === "object" && log.hierarchy.buildId !== null)
      pathParts.push(log.hierarchy.buildId.name || log.hierarchy.buildId.code);
    if (typeof log.hierarchy?.streetId === "object" && log.hierarchy.streetId !== null)
      pathParts.push(log.hierarchy.streetId.name || log.hierarchy.streetId.code);
    pathParts.push(log.stockName);

    return pathParts.filter(Boolean).reverse().join(" > ");
  };

  const formatHierarchySummaryDisplay = (
    _value: unknown,
    log: IGetAuditLogStock
  ): ReactNode => {
    return log.action === "INACTIVATE_HIERARCHY"
      ? `Ruas: ${log.hierarchyDetails?.streets ?? 0}, Prédios: ${
          log.hierarchyDetails?.builds ?? 0
        }, Andares: ${log.hierarchyDetails?.floors ?? 0}`
      : "-";
  };

  const handleViewChanges = (log: IGetAuditLogStock) => {
    setSelectedLogDetails(log);
    setIsChangesModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      <LogChangesModal
        open={isChangesModalOpen}
        setOpen={setIsChangesModalOpen}
        logDetails={
          selectedLogDetails
            ? {
                action: selectedLogDetails.action,
                userId: selectedLogDetails.userId,
                targetId: selectedLogDetails.targetId,
                targetType: selectedLogDetails.targetModel,
                targetName: selectedLogDetails.stockName,
                timestamp: selectedLogDetails.createdAt || selectedLogDetails.timestamp,
                createdAt: selectedLogDetails.createdAt,
                changes: selectedLogDetails.changes,
              }
            : null
        }
      />

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Registros de Estoque</Subtitle>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-0 sm:gap-6 relative">
          <Input
            data={search}
            onChange={({ target }) => setSearch(target.value)}
            icon={<Search />}
            iconPosition="left"
            wide
            className="bg-neutral-0 -my-2.5 w-full"
            placeholder={getPlaceholder()}
          />
          <Button
            variant="naked"
            color="default"
            className="border"
            onClick={toggleFilters}
          >
            <Filter />{" "}
            <Caption variant="large">
              {STOCK_LOG_FILTER_OPTIONS.find((option) => option.value === selectedFilter)
                ?.label || "Filtrar"}
            </Caption>
          </Button>

          {showFilters && (
            <FilterOptions
              selectedFilter={selectedFilter}
              onClose={toggleFilters}
              onSelectFilter={handleSelectFilter}
              filterOptions={STOCK_LOG_FILTER_OPTIONS}
            >
              {selectedFilter === "hierarchyLevel" && (
                <Input
                  data={hierarchyLevelFilter}
                  onChange={({ target }) => setHierarchyLevelFilter(target.value)}
                  wide
                  placeholder="Nível da Hierarquia (STOCK, STREET, BUILD, FLOOR)"
                  className="bg-neutral-0 mt-2"
                />
              )}
              {selectedFilter === "includeHierarchy" && (
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={includeHierarchyFilter}
                    onChange={(e) => setIncludeHierarchyFilter(e.target.checked)}
                  />
                  <Caption variant="large">
                    Incluir registros de inativação de hierarquia
                  </Caption>
                </label>
              )}
            </FilterOptions>
          )}
        </div>
      </div>

      {isLoadingMetrics ? (
        <SpinningLogo />
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <OverviewCard
            icon={<LayoutGrid className="size-7" />}
            title="Total de Registros de Estoque"
            value={stockMetrics?.totalStockLogs || 0}
          />
          <OverviewCard
            icon={<Home className="size-7" />}
            title="Estoque Inativado"
            value={stockMetrics?.inactivatedStocks || 0}
          />
          <OverviewCard
            icon={<Package className="size-7" />}
            title="Estoques Ativos"
            value={stockMetrics?.totalActiveStocks || 0}
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
            {
              label: "Ação",
              key: "action",
              render: (value) => formatActionForDisplay(value),
            },
            {
              label: "Usuário",
              key: "userId",
              render: (userIdValue: unknown, row: IGetAuditLogStock) =>
                resolveUserIdDisplay(userIdValue, row),
            },
            {
              label: "Tipo do Alvo",
              key: "targetModel",
              render: (value) => formatTargetModelDisplay(value),
            },
            {
              label: "Alvo",
              key: "targetId",
              cellClassName: "max-w-[200px] break-words",
              render: (targetIdValue: unknown, row: IGetAuditLogStock) =>
                resolveTargetIdDisplay(targetIdValue, row),
            },
            {
              label: "Caminho da Hierarquia",
              key: "hierarchy",
              cellClassName: "max-w-[300px] break-words",
              render: (_value: unknown, row: IGetAuditLogStock) =>
                formatHierarchyPathDisplay(_value, row),
            },
            {
              label: "Detalhes da Hierarquia",
              key: "hierarchyDetails",
              cellClassName: "max-w-[250px] break-words",
              render: (_value: unknown, row: IGetAuditLogStock) =>
                formatHierarchySummaryDisplay(_value, row),
            },
            {
              label: "Data/Hora",
              key: "createdAt",
              render: (value) => formatDateToDDMMYYYY(value),
            },
            {
              label: "Detalhes",
              key: "changes",
              cellClassName: "w-10 text-center",
              render: (_changesValue: unknown, row: IGetAuditLogStock) => (
                <IconButton size="large" onClick={() => handleViewChanges(row)}>
                  <Dots />
                </IconButton>
              ),
            },
          ]}
          actionButton={false}
          customMappings={{
            action: {
              CREATE: "Criação",
              UPDATE: "Atualização",
              DELETE: "Exclusão",
              INACTIVATE: "Inativação",
              REACTIVATE: "Reativação",
              INACTIVATE_HIERARCHY: "Inativação de Hierarquia",
            },
            targetModel: {
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
