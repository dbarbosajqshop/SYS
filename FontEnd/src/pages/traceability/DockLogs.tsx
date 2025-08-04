import { Search } from "@/icons/Search";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState, useEffect, useMemo } from "react";
import { Table } from "@/ui/Table";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { useDockAuditLogs } from "@/hooks/useDockAuditLogs";
import { IGetAuditLogDock } from "@/types/auditLogs";
import { Filter } from "@/icons/Filter";
import { Caption } from "@/ui/typography/Caption";
import { Button } from "@/ui/Button";
import { FilterOptions } from "@/components/FilterOptions";
import { DOCK_LOG_FILTER_OPTIONS } from "@/constants";
import { TraceabilityTabs } from "./TraceabilityTabs";
import { LogChangesModal } from "@/components/LogChangesModal";
import { IconButton } from "@/ui/IconButton";
import { Dots } from "@/icons/Dots";
import { useQuery } from "@tanstack/react-query";
import { OverviewCard } from "@/components/OverviewCard";
import { Warehouse, PlusSquare, Edit3, CheckSquare } from "lucide-react";
import { getDockAuditMetrics } from "@/services/dockAuditMetrics";

export default function DockLogs() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [dSearch] = useDebounce(search, 500);
  const { logs, loading, fetchLogs } = useDockAuditLogs();
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState<IGetAuditLogDock | null>(null);
  const metricsQueryParams = useMemo(() => {
    const params: { [key: string]: string | undefined } = {};
    if (selectedFilter && selectedFilter !== "") {
      params[selectedFilter] = dSearch;
    } else {
      params.search = dSearch;
    }
    return params;
  }, [selectedFilter, dSearch]);

  const { data: dockMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["dockAuditMetrics", metricsQueryParams],
    queryFn: () => getDockAuditMetrics(metricsQueryParams),
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
    const option = DOCK_LOG_FILTER_OPTIONS.find(opt => opt.value === selectedFilter);
    if (option && option.value !== "") {
      return `Buscar por ${option.label.toLowerCase().replace('(id)', 'ID')}`;
    }
    return 'Buscar termo geral...';
  };

  const handleViewChanges = (log: IGetAuditLogDock) => {
    setSelectedLogDetails(log);
    setIsChangesModalOpen(true);
  };

  const resolveUserIdDisplay = (
    userIdValue: unknown,
    _row: IGetAuditLogDock 
  ): string => {
    void _row; //

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

  const resolveTargetIdDisplay = (targetIdValue: unknown, row: IGetAuditLogDock): string => {
    if (row.targetName) { 
        return row.targetName;
    }
    if (typeof targetIdValue === 'object' && targetIdValue !== null) {
      const targetObj = targetIdValue as { _id: string; name?: string; code?: string; email?: string; orderNumber?: string };
      return targetObj.code || targetObj.name || (targetObj._id ? targetObj._id.substring(0, 8) + '...' : 'N/A'); 
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
        <Subtitle variant="large">Registros de Docas</Subtitle>
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
              {DOCK_LOG_FILTER_OPTIONS.find((option) => option.value === selectedFilter)
                ?.label || "Filtrar"}
            </Caption>
          </Button>

          {showFilters && (
            <FilterOptions
              selectedFilter={selectedFilter}
              onClose={toggleFilters}
              onSelectFilter={handleSelectFilter}
              filterOptions={DOCK_LOG_FILTER_OPTIONS}
            />
          )}
        </div>
      </div>

      {isLoadingMetrics ? (
        <SpinningLogo />
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <OverviewCard
            icon={<Warehouse className="size-7" />}
            title="Total de Registros de Docas"
            value={dockMetrics?.totalDockLogs || 0}
          />
          <OverviewCard
            icon={<PlusSquare className="size-7" />}
            title="Novas Docas"
            value={dockMetrics?.newDockCreatesMonth || 0}
          />
          <OverviewCard
            icon={<Edit3 className="size-7" />}
            title="Docas Alteradas"
            value={dockMetrics?.updatedDocksLastWeek || 0}
          />
          <OverviewCard
            icon={<CheckSquare className="size-7" />}
            title="Docas Ativadas"
            value={dockMetrics?.activatedDocksMonth || 0}
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
              render: (userIdValue: unknown, row: IGetAuditLogDock) => resolveUserIdDisplay(userIdValue, row)
            },
            {
              label: "Alvo (Doca)",
              key: "targetId",
              cellClassName: "max-w-[200px] break-words",
              render: (targetIdValue: unknown, row: IGetAuditLogDock) => resolveTargetIdDisplay(targetIdValue, row)
            },
            { label: "Data/Hora", key: "timestamp" },
            {
              label: "Detalhes",
              key: "changes",
              cellClassName: "w-10 text-center",
              render: (_changesValue: unknown, row: IGetAuditLogDock) => (
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
                Dock: "Doca",
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