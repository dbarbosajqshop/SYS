import { Search } from "@/icons/Search";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Table } from "@/ui/Table";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { useUserAuditLogs } from "@/hooks/useUserAuditLogs";
import { IGetAuditLogUser } from "@/types/auditLogs";
import { Filter } from "@/icons/Filter";
import { Caption } from "@/ui/typography/Caption";
import { Button } from "@/ui/Button";
import { FilterOptions } from "@/components/FilterOptions";
import { USER_LOG_FILTER_OPTIONS } from "@/constants";
import { formatAction } from "@/helpers/logFormatters";
import { TraceabilityTabs } from "./TraceabilityTabs";
import { TableHeader } from "@/types/table";
import { LogChangesModal } from "@/components/LogChangesModal";
import { IconButton } from "@/ui/IconButton";
import { Dots } from "@/icons/Dots";
import { useQuery } from "@tanstack/react-query";
import { OverviewCard } from "@/components/OverviewCard";
import { Users, UserPlus, UserCog, Briefcase } from "lucide-react";
import { getUserAuditMetrics } from "@/services/userAuditMetrics";

export default function UserLogs() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("generalSearch");
  const [dSearch] = useDebounce(search, 500);
  const { logs, loading, fetchLogs } = useUserAuditLogs();
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState<IGetAuditLogUser | null>(null);

  const queryParams = useMemo(() => {
    const params: { [key: string]: string | undefined } = {};

    if (selectedFilter === "action") {
      params.action = dSearch;
    } else if (selectedFilter === "userId") {
      params.userId = dSearch;
    } else if (selectedFilter === "targetId") {
      params.targetId = dSearch;
    } else if (selectedFilter === "userName") { // Filtrar por nome/email do usuário
      params.search = dSearch;
      params.param = "userName"; // Sinaliza ao backend para buscar no nome do usuário
    } else if (selectedFilter === "targetName") { // Filtrar por nome/email do alvo
      params.search = dSearch;
      params.param = "targetName"; // Sinaliza ao backend para buscar no nome do alvo
    } else if (selectedFilter === "generalSearch" || selectedFilter === "") {
      params.search = dSearch;
    }

    return params;
  }, [selectedFilter, dSearch]);

  const { data: userMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["userAuditMetrics", queryParams],
    queryFn: () => getUserAuditMetrics(queryParams),
  });

  useEffect(() => {
    fetchLogs(queryParams);
  }, [queryParams, fetchLogs]);


  const handlePageClick = useCallback((page: number) => {
    const params: { [key: string]: string | number | undefined } = { ...queryParams, page };
    fetchLogs(params);
  }, [queryParams, fetchLogs]);

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleSelectFilter = (filter: string) => {
    setSelectedFilter(filter);
    setSearch("");
  };

  const getPlaceholder = () => {
    const option = USER_LOG_FILTER_OPTIONS.find(opt => opt.value === selectedFilter);
    if (option) {
      if (option.value === "userId" || option.value === "targetId") {
        return `Buscar por ${option.label.toLowerCase().replace('(id)', 'ID')}`;
      } else if (option.value === "userName") {
        return `Buscar por nome ou email do usuário...`;
      } else if (option.value === "targetName") {
        return `Buscar por nome do alvo...`;
      } else if (option.value === "generalSearch") {
        return 'Buscar termo geral (Nome/Email/ID)...';
      }
      return `Buscar por ${option.label.toLowerCase()}`;
    }
    return 'Buscar termo geral...';
  };

  const handleViewChanges = (log: IGetAuditLogUser) => {
    setSelectedLogDetails(log);
    setIsChangesModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">

      <LogChangesModal
        open={isChangesModalOpen}
        setOpen={setIsChangesModalOpen}
        logDetails={selectedLogDetails}
      />

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Registros de Usuários</Subtitle>
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
              {USER_LOG_FILTER_OPTIONS.find((option) => option.value === selectedFilter)
                ?.label || "Filtrar"}
            </Caption>
          </Button>

          {showFilters && (
            <FilterOptions
              selectedFilter={selectedFilter}
              onClose={toggleFilters}
              onSelectFilter={handleSelectFilter}
              filterOptions={USER_LOG_FILTER_OPTIONS}
            />
          )}
        </div>
      </div>

      {isLoadingMetrics ? (
        <SpinningLogo />
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <OverviewCard
            icon={<Users className="size-7" />}
            title="Total de Registros de Usuários"
            value={userMetrics?.totalUserLogs || 0}
          />
          <OverviewCard
            icon={<UserPlus className="size-7" />}
            title="Novos Usuários"
            value={userMetrics?.newUsersLoggedMonth || 0}
          />
          <OverviewCard
            icon={<UserCog className="size-7" />}
            title="Usuários Alterados"
            value={userMetrics?.updatedUsersLastWeek || 0}
          />
          <OverviewCard
            icon={<Briefcase className="size-7" />}
            title="Cargos"
            value={userMetrics?.logsByRoleTarget || 0}
          />
        </div>
      )}

      <TraceabilityTabs />

      {loading ? (
        <SpinningLogo />
      ) : (
        logs?.data && logs.data.length > 0 ? (
          <>
            <Table
              data={logs.data.map((log: IGetAuditLogUser) => {
                // Esta lógica de display é importante para mostrar os nomes populados
                const displayUserId =
                  typeof log.userId === 'object' && log.userId !== null
                    ? log.userId.name || log.userId.email || log.userId._id
                    : log.userId;

                const displayTargetId =
                  typeof log.targetId === 'object' && log.targetId !== null
                    ? log.targetId.name || log.targetId._id
                    : log.targetId;

                return {
                  ...log,
                  action: formatAction(log.action),
                  userId: displayUserId,
                  targetId: log.targetName || displayTargetId,
                  timestamp: new Date(log.timestamp).toLocaleString(),
                  changes: (
                    <IconButton size="large" onClick={() => handleViewChanges(log)}>
                      <Dots />
                    </IconButton>
                  ),
                };
              })}
              headers={[
                { label: "Ação", key: "action" } as TableHeader,
                { label: "Usuário", key: "userId" } as TableHeader,
                { label: "Tipo do Alvo", key: "targetType" } as TableHeader,
                { label: "Alvo", key: "targetId", cellClassName: "max-w-[250px] break-words" } as TableHeader,
                { label: "Data/Hora", key: "timestamp" } as TableHeader,
                { label: "Detalhes", key: "changes", cellClassName: "w-10 text-center" } as TableHeader,
              ]}
              actionButton={false}
            />
            <Pagination
              currentPage={logs.pagination.page}
              totalItems={logs.pagination.total}
              totalPages={logs.pagination.totalPages}
              limit={logs.pagination.limit}
              handlePageClick={handlePageClick}
            />
          </>
        ) : (
          <div className="flex justify-center items-center py-4">
            <Subtitle variant="large" color="text-neutral-500">Nenhum log de usuário encontrado.</Subtitle>
          </div>
        )
      )}
    </div>
  );
}