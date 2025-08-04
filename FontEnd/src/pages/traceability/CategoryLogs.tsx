import { Search } from "@/icons/Search";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState, useEffect, useMemo } from "react";
import { Table } from "@/ui/Table";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { useCategoryAuditLogs } from "@/hooks/useCategoryAuditLogs";
import { IGetAuditLogCategory } from "@/types/auditLogs";
import { Filter } from "@/icons/Filter";
import { Caption } from "@/ui/typography/Caption";
import { Button } from "@/ui/Button";
import { FilterOptions } from "@/components/FilterOptions";
import { CATEGORY_LOG_FILTER_OPTIONS } from "@/constants";
import { TraceabilityTabs } from "./TraceabilityTabs";
import { LogChangesModal } from "@/components/LogChangesModal";
import { IconButton } from "@/ui/IconButton";
import { Dots } from "@/icons/Dots";
import { useQuery } from "@tanstack/react-query";
import { OverviewCard } from "@/components/OverviewCard";
import { Tags, PlusSquare, Edit3, CheckSquare } from "lucide-react";
import { getCategoryAuditMetrics } from "@/services/categoryAuditMetrics";

export default function CategoryLogs() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [dSearch] = useDebounce(search, 500);
  const { logs, loading, fetchLogs } = useCategoryAuditLogs();
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState<IGetAuditLogCategory | null>(null);
  const metricsQueryParams = useMemo(() => {
    const params: { [key: string]: string | undefined } = {};
    if (selectedFilter && selectedFilter !== "") {
      params[selectedFilter] = dSearch;
    } else {
      params.search = dSearch;
    }
    return params;
  }, [selectedFilter, dSearch]);

  const { data: categoryMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["categoryAuditMetrics", metricsQueryParams],
    queryFn: () => getCategoryAuditMetrics(metricsQueryParams),
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
    const option = CATEGORY_LOG_FILTER_OPTIONS.find(opt => opt.value === selectedFilter);
    if (option && option.value !== "") {
      return `Buscar por ${option.label.toLowerCase().replace('(id)', 'ID')}`;
    }
    return 'Buscar termo geral...';
  };

  const handleViewChanges = (log: IGetAuditLogCategory) => {
    setSelectedLogDetails(log);
    setIsChangesModalOpen(true);
  };

  const getDisplayString = (value: unknown): string => {
    if (typeof value === 'object' && value !== null) {
      const obj = value as { _id: string; name?: string; email?: string; code?: string };
      return obj.name || obj.email || obj.code || obj._id; 
    }
    return String(value || 'N/A'); 
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
        <Subtitle variant="large">Registros de Categorias</Subtitle>
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
              {CATEGORY_LOG_FILTER_OPTIONS.find((option) => option.value === selectedFilter)
                ?.label || "Filtrar"}
            </Caption>
          </Button>

          {showFilters && (
            <FilterOptions
              selectedFilter={selectedFilter}
              onClose={toggleFilters}
              onSelectFilter={handleSelectFilter}
              filterOptions={CATEGORY_LOG_FILTER_OPTIONS}
            />
          )}
        </div>
      </div>

      {isLoadingMetrics ? (
        <SpinningLogo />
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <OverviewCard
            icon={<Tags className="size-7" />}
            title="Total de Registros de Categorias"
            value={categoryMetrics?.totalCategoryLogs || 0}
          />
          <OverviewCard
            icon={<PlusSquare className="size-7" />}
            title="Novas Categorias"
            value={categoryMetrics?.newCategoryCreatesMonth || 0}
          />
          <OverviewCard
            icon={<Edit3 className="size-7" />}
            title="Categorias Alteradas"
            value={categoryMetrics?.updatedCategoriesLastWeek || 0}
          />
          <OverviewCard
            icon={<CheckSquare className="size-7" />}
            title="Categorias Ativadas"
            value={categoryMetrics?.activatedCategoriesMonth || 0}
          />
        </div>
      )}

      <TraceabilityTabs />

      {loading ? (
        <SpinningLogo />
      ) : (
        <Table
          data={logs?.data.map((log: IGetAuditLogCategory) => {
            const displayUserId = getDisplayString(log.userId);
            const displayTargetId = getDisplayString(log.targetId);

            const rawTimestamp = log.createdAt || log.timestamp;

            return {
              ...log,
              userId: displayUserId, 
              targetId: log.targetName || displayTargetId, 
              timestamp: rawTimestamp,
              changes: (
                <IconButton size="large" onClick={() => handleViewChanges(log)}>
                  <Dots />
                </IconButton>
              ),
            };
          }) || []} 
          headers={[
            { label: "Ação", key: "action" },
            { label: "Usuário", key: "userId" },
            { label: "Tipo do Alvo", key: "targetType" },
            { label: "Alvo", key: "targetId", cellClassName: "max-w-[250px] break-words" },
            { label: "Data/Hora", key: "timestamp" },
            {
              label: "Detalhes",
              key: "changes",
              cellClassName: "w-10 text-center",
              render: (_changesValue: unknown, row: IGetAuditLogCategory) => (
                <IconButton size="large" onClick={() => handleViewChanges(row)}>
                  <Dots />
                </IconButton>
              )
            },
          ]}
          actionButton={false}
          customMappings={{
            action: { CREATE: "Criação", UPDATE: "Atualização", DELETE: "Exclusão", INACTIVATE: "Inativação", REACTIVATE: "Reativação" },
            targetType: {
                Category: "Categoria",
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