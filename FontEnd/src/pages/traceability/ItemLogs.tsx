import { Search } from "@/icons/Search";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState, useEffect, useMemo } from "react";
import { Table } from "@/ui/Table";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { useItemAuditLogs } from "@/hooks/useItemAuditLogs";
import { IGetAuditLogItem } from "@/types/auditLogs";
import { Filter } from "@/icons/Filter";
import { Caption } from "@/ui/typography/Caption";
import { Button } from "@/ui/Button";
import { FilterOptions } from "@/components/FilterOptions";
import { ITEM_LOG_FILTER_OPTIONS } from "@/constants";
import { TraceabilityTabs } from "./TraceabilityTabs";
import { LogChangesModal } from "@/components/LogChangesModal";
import { IconButton } from "@/ui/IconButton";
import { Dots } from "@/icons/Dots";
import { useQuery } from "@tanstack/react-query";
import { OverviewCard } from "@/components/OverviewCard";
import { Package, PenTool, Tags, Image } from "lucide-react";
import { getItemAuditMetrics } from "@/services/itemAuditMetrics";

export default function ItemLogs() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [dSearch] = useDebounce(search, 500);
  const { logs, loading, fetchLogs } = useItemAuditLogs();
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState<IGetAuditLogItem | null>(null);
  const metricsQueryParams = useMemo(() => {
    const params: { [key: string]: string | undefined } = {};
    if (selectedFilter && selectedFilter !== "") {
      params[selectedFilter] = dSearch;
    } else {
      params.search = dSearch;
    }
    return params;
  }, [selectedFilter, dSearch]);

  const { data: itemMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["itemAuditMetrics", metricsQueryParams],
    queryFn: () => getItemAuditMetrics(metricsQueryParams),
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
    const option = ITEM_LOG_FILTER_OPTIONS.find(opt => opt.value === selectedFilter);
    if (option && option.value !== "") {
      return `Buscar por ${option.label.toLowerCase().replace('(id)', 'ID')}`;
    }
    return 'Buscar termo geral...';
  };

  const handleViewChanges = (log: IGetAuditLogItem) => {
    setSelectedLogDetails(log);
    setIsChangesModalOpen(true);
  };

  const resolveUserIdDisplay = (
    userIdValue: unknown,
    _row: IGetAuditLogItem
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

  const resolveTargetIdDisplay = (targetIdValue: unknown, row: IGetAuditLogItem): string => {
    if (row.targetName) { 
      return row.targetName;
    }
    if (typeof targetIdValue === 'object' && targetIdValue !== null) {
      const targetObj = targetIdValue as { _id: string; name?: string; code?: string; email?: string; sku?: string }; 
      return targetObj.name || targetObj.sku || targetObj.code || (targetObj._id ? targetObj._id.substring(0, 8) + '...' : 'N/A');
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
        <Subtitle variant="large">Registros de Itens</Subtitle>
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
              {ITEM_LOG_FILTER_OPTIONS.find((option) => option.value === selectedFilter)
                ?.label || "Filtrar"}
            </Caption>
          </Button>

          {showFilters && (
            <FilterOptions
              selectedFilter={selectedFilter}
              onClose={toggleFilters}
              onSelectFilter={handleSelectFilter}
              filterOptions={ITEM_LOG_FILTER_OPTIONS}
            />
          )}
        </div>
      </div>

      {isLoadingMetrics ? (
        <SpinningLogo />
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <OverviewCard
            icon={<Package className="size-7" />}
            title="Registros de Itens"
            value={itemMetrics?.totalItemLogs || 0}
          />
          <OverviewCard
            icon={<PenTool className="size-7" />}
            title="Itens Alterados"
            value={itemMetrics?.updatedItemsLastWeek || 0}
          />
          <OverviewCard
            icon={<Tags className="size-7" />}
            title="Registro de Categorias"
            value={itemMetrics?.logsByItemCategoryTarget || 0}
          />
          <OverviewCard
            icon={<Image className="size-7" />}
            title="Registro de Fotos"
            value={itemMetrics?.logsByItemPhotoTarget || 0}
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
              render: (userIdValue: unknown, row: IGetAuditLogItem) => resolveUserIdDisplay(userIdValue, row)
            },
            {
              label: "Tipo do Alvo", 
              key: "targetType",
            },
            {
              label: "Alvo",
              key: "targetId", 
              cellClassName: "max-w-[250px] break-words", 
              render: (targetIdValue: unknown, row: IGetAuditLogItem) => resolveTargetIdDisplay(targetIdValue, row)
            },
            { label: "Data/Hora", key: "createdAt" }, 
            {
              label: "Detalhes",
              key: "changes",
              cellClassName: "w-10 text-center",
              render: (_changesValue: unknown, row: IGetAuditLogItem) => (
                <IconButton size="large" onClick={() => handleViewChanges(row)}>
                  <Dots />
                </IconButton>
              )
            },
          ]}
          actionButton={false} 
          customMappings={{
            action: { CREATE: "Criação", UPDATE: "Atualização", DELETE: "Exclusão", INACTIVATE: "Inativação", REACTIVATE: "Reativação", UPDATE_PHOTO: "Atualização de Foto" },
            targetType: {
              Item: "Item",
              ItemCategory: "Categoria de Item", 
              ItemPhoto: "Foto de Item"
            },
          }}
          dateFields={["createdAt"]}
          imageField="targetId.imageUrl" 
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