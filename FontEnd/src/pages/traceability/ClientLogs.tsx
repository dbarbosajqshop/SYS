import { Search } from "@/icons/Search";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState, useEffect } from "react";
import { Table } from "@/ui/Table";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { useClientAuditLogs } from "@/hooks/useClientAuditLogs";
import { IGetAuditLogClient } from "@/types/auditLogs";
import { Filter } from "@/icons/Filter";
import { Caption } from "@/ui/typography/Caption";
import { Button } from "@/ui/Button";
import { FilterOptions } from "@/components/FilterOptions";
import { CLIENT_LOG_FILTER_OPTIONS } from "@/constants";
import { TraceabilityTabs } from "./TraceabilityTabs";
import { LogChangesModal } from "@/components/LogChangesModal";
import { IconButton } from "@/ui/IconButton";
import { Dots } from "@/icons/Dots";
import { useQuery } from "@tanstack/react-query";
import { OverviewCard } from "@/components/OverviewCard";
import { Users, UserPlus, UserCog } from "lucide-react";
import { getClientAuditMetrics } from "@/services/clientAuditMetrics";

export default function ClientLogs() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [dSearch] = useDebounce(search, 500);
  const { logs, loading, fetchLogs } = useClientAuditLogs();
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState<IGetAuditLogClient | null>(null);
  const { data: clientMetrics } = useQuery({
    queryKey: ["clientAuditMetrics"],
    queryFn: () => getClientAuditMetrics(),
  });

  useEffect(() => {
    const params: { [key: string]: string | undefined } = {};
    if (selectedFilter && selectedFilter !== "") {
      params[selectedFilter] = dSearch;
    } else {
      params.search = dSearch;
    }
    fetchLogs(params);
  }, [selectedFilter, dSearch, fetchLogs]);

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
    const option = CLIENT_LOG_FILTER_OPTIONS.find(opt => opt.value === selectedFilter);
    if (option && option.value !== "") {
      return `Buscar por ${option.label.toLowerCase().replace('(id)', 'ID')}`;
    }
    return 'Buscar termo geral...';
  };

  const handleViewChanges = (log: IGetAuditLogClient) => {
    setSelectedLogDetails(log);
    setIsChangesModalOpen(true);
  };

  // Funções helper para display de Usuário e Alvo (padronizadas)
  const resolveUserIdDisplay = (
    userIdValue: unknown,
    _row: IGetAuditLogClient // Mantenha o _ para indicação visual
  ): string => {
    // Adicione uma linha para "usar" _row, silenciando o linter
    void _row; // Isso "usa" a variável sem efeito colateral no runtime

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

  const resolveTargetIdDisplay = (targetIdValue: unknown, row: IGetAuditLogClient): string => {
    // Para ClientLogs, targetName é log.clientName. targetId pode ser um objeto de cliente.
    if (row.clientName) { // Prioriza clientName se existir na raiz do log
        return row.clientName;
    }
    if (typeof targetIdValue === 'object' && targetIdValue !== null) {
      const targetObj = targetIdValue as { _id: string; name?: string; code?: string; email?: string; orderNumber?: string };
      return targetObj.name || targetObj.code || targetObj.email || targetObj.orderNumber || (targetObj._id ? targetObj._id.substring(0, 8) + '...' : 'N/A');
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
            targetType: "Client",
            targetName: selectedLogDetails.clientName,
            timestamp: selectedLogDetails.createdAt,
            createdAt: selectedLogDetails.createdAt,
            changes: selectedLogDetails.changes,
        } : null}
      />

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Registros de Clientes</Subtitle>
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
              {CLIENT_LOG_FILTER_OPTIONS.find((option) => option.value === selectedFilter)
                ?.label || "Filtrar"}
            </Caption>
          </Button>

          {showFilters && (
            <FilterOptions
              selectedFilter={selectedFilter}
              onClose={toggleFilters}
              onSelectFilter={handleSelectFilter}
              filterOptions={CLIENT_LOG_FILTER_OPTIONS}
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap gap-6">
        <OverviewCard
          icon={<Users className="size-7" />}
          title="Total de Registros de Clientes"
          value={clientMetrics?.totalClientLogs || 0}
        />
        <OverviewCard
          icon={<UserPlus className="size-7" />}
          title="Novos Clientes"
          value={clientMetrics?.newClientsLoggedMonth || 0}
        />
        <OverviewCard
          icon={<UserCog className="size-7" />}
          title="Clientes Alterados"
          value={clientMetrics?.updatedClientsLastWeek || 0}
        />
      </div>

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
              render: (userIdValue: unknown, row: IGetAuditLogClient) => resolveUserIdDisplay(userIdValue, row)
            },
            {
              label: "Alvo (Cliente)",
              key: "targetId",
              cellClassName: "max-w-[250px] break-words",
              render: (targetIdValue: unknown, row: IGetAuditLogClient) => resolveTargetIdDisplay(targetIdValue, row)
            },
            { label: "Data/Hora", key: "createdAt" },
            {
              label: "Detalhes",
              key: "changes",
              cellClassName: "w-10 text-center",
              render: (_changesValue: unknown, row: IGetAuditLogClient) => (
                <IconButton size="large" onClick={() => handleViewChanges(row)}>
                  <Dots />
                </IconButton>
              )
            },
          ]}
          actionButton={false}
          customMappings={{
            action: { CREATE: "Criação", UPDATE: "Atualização", DELETE: "Exclusão", INACTIVATE: "Inativação", REACTIVATE: "Reativação", ADD_VOUCHER: "Adição de Voucher" },
            targetType: {
                Client: "Cliente",
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