import { Search } from "@/icons/Search";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState, useEffect, useMemo } from "react";
import { Table } from "@/ui/Table";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { useTaxAuditLogs } from "@/hooks/useTaxAuditLogs";
import { IGetAuditLogTax } from "@/types/auditLogs";
import { Filter } from "@/icons/Filter";
import { Caption } from "@/ui/typography/Caption";
import { Button } from "@/ui/Button";
import { FilterOptions } from "@/components/FilterOptions";
import { TAX_LOG_FILTER_OPTIONS } from "@/constants";
import { TraceabilityTabs } from "./TraceabilityTabs";
import { LogChangesModal } from "@/components/LogChangesModal";
import { IconButton } from "@/ui/IconButton";
import { Dots } from "@/icons/Dots";
import { useQuery } from "@tanstack/react-query";
import { OverviewCard } from "@/components/OverviewCard";
import { Percent, PlusCircle, Edit3, CheckSquare } from "lucide-react";
import { getTaxAuditMetrics } from "@/services/taxAuditMetrics";

export default function TaxLogs() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [dSearch] = useDebounce(search, 500);
  const { logs, loading, fetchLogs } = useTaxAuditLogs();
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState<IGetAuditLogTax | null>(null);
  const metricsQueryParams = useMemo(() => {
    const params: { [key: string]: string | undefined } = {};
    if (selectedFilter && selectedFilter !== "") {
      params[selectedFilter] = dSearch;
    } else {
      params.search = dSearch;
    }
    return params;
  }, [selectedFilter, dSearch]);

  const { data: taxMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["taxAuditMetrics", metricsQueryParams],
    queryFn: () => getTaxAuditMetrics(metricsQueryParams),
  });

  useEffect(() => {
    fetchLogs(metricsQueryParams);
  }, [metricsQueryParams, fetchLogs]);

  const handlePageClick = (page: number) => {
    const params: { [key: string]: string | number | undefined } = { page };
    if (selectedFilter && selectedFilter !== "") {
      params[selectedFilter] = dSearch;
    } else {
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
    const option = TAX_LOG_FILTER_OPTIONS.find(opt => opt.value === selectedFilter);
    if (option && option.value !== "") {
      return `Buscar por ${option.label.toLowerCase().replace('(id)', 'ID')}`;
    }
    return 'Buscar termo geral...';
  };

  const handleViewChanges = (log: IGetAuditLogTax) => {
    setSelectedLogDetails(log);
    setIsChangesModalOpen(true);
  };

  const resolveUserIdDisplay = (
    userIdValue: unknown,
    _row: IGetAuditLogTax
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

  const resolveTargetIdDisplay = (targetIdValue: unknown, row: IGetAuditLogTax): string => {
    if (row.targetName) {
      return row.targetName;
    }
    if (typeof targetIdValue === 'object' && targetIdValue !== null) {
      const targetObj = targetIdValue as { _id: string; name?: string; code?: string; email?: string };
      return targetObj.name || targetObj.code || (targetObj._id ? targetObj._id.substring(0, 8) + '...' : 'N/A');
    }
    if (typeof targetIdValue === 'string') {
      if (targetIdValue.length === 24 && targetIdValue.match(/^[0-9a-fA-F]{24}$/)) {
        return targetIdValue.substring(0, 8) + '...';
      }
      return targetIdValue;
    }
    return String(targetIdValue || 'N/A');
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
          timestamp: selectedLogDetails.timestamp,
          createdAt: selectedLogDetails.createdAt,
          changes: selectedLogDetails.changes,
        } : null}
      />

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Registros</Subtitle>
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
              {TAX_LOG_FILTER_OPTIONS.find((option) => option.value === selectedFilter)
                ?.label || "Filtrar"}
            </Caption>
          </Button>

          {showFilters && (
            <FilterOptions
              selectedFilter={selectedFilter}
              onClose={toggleFilters}
              onSelectFilter={handleSelectFilter}
              filterOptions={TAX_LOG_FILTER_OPTIONS}
            />
          )}
        </div>
      </div>

      {isLoadingMetrics ? (
        <SpinningLogo />
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <OverviewCard
            icon={<Percent className="size-7" />}
            title="Total de Registros de Taxas"
            value={taxMetrics?.totalTaxLogs || 0}
          />
          <OverviewCard
            icon={<PlusCircle className="size-7" />}
            title="Novas Taxas"
            value={taxMetrics?.newTaxCreatesMonth || 0}
          />
          <OverviewCard
            icon={<Edit3 className="size-7" />}
            title="Taxas Alteradas"
            value={taxMetrics?.updatedTaxesLastWeek || 0}
          />
          <OverviewCard
            icon={<CheckSquare className="size-7" />}
            title="Taxas Selecionadas"
            value={taxMetrics?.taxesSelectedMonth || 0}
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
              render: (userIdValue: unknown, row: IGetAuditLogTax) => resolveUserIdDisplay(userIdValue, row)
            },
            {
              label: "Alvo (Taxa)",
              key: "targetId",
              cellClassName: "max-w-[250px] break-words",
              render: (targetIdValue: unknown, row: IGetAuditLogTax) => resolveTargetIdDisplay(targetIdValue, row)
            },
            { label: "Data/Hora", key: "timestamp" },
            {
              label: "Detalhes",
              key: "changes",
              cellClassName: "w-10 text-center",
              render: (_changesValue: unknown, row: IGetAuditLogTax) => (
                <IconButton size="large" onClick={() => handleViewChanges(row)}>
                  <Dots />
                </IconButton>
              )
            },
          ]}
          actionButton={false}
          customMappings={{
            action: { CREATE: "Criação", UPDATE: "Atualização", DELETE: "Exclusão", INACTIVATE: "Inativação", REACTIVATE: "Reativação", SELECT: "Seleção (Ativar)" },
            targetType: {
              Tax: "Taxa",
            },
          }}
          dateFields={["timestamp"]}
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