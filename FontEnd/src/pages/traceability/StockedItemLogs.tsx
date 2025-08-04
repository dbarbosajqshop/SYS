import { Search } from "@/icons/Search";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Table } from "@/ui/Table";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { IGetAuditLogStockedItem, IAuditLogChange } from "@/types/auditLogs";
import { Filter } from "@/icons/Filter";
import { Caption } from "@/ui/typography/Caption";
import { Button } from "@/ui/Button";
import { FilterOptions } from "@/components/FilterOptions";
import { STOCKED_ITEM_LOG_FILTER_OPTIONS } from "@/constants";
import { TraceabilityTabs } from "./TraceabilityTabs";
import { LogChangesModal } from "@/components/LogChangesModal";
import { IconButton } from "@/ui/IconButton";
import { Dots } from "@/icons/Dots";
import { useQuery } from "@tanstack/react-query";
import { OverviewCard } from "@/components/OverviewCard";
import { LayoutGrid, Home, Package } from "lucide-react";
import { ReactNode } from "react";
import { TableHeader } from "@/types/table";
import { useStockedItemAuditLogs } from "@/hooks/useStockedItemAuditLogs";
import { getStockedItemAuditMetrics } from "@/services/auditLogs";

export default function StockedItemLogs() {
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [dSearch] = useDebounce(search, 500);
    const { logs, loading, fetchLogs } = useStockedItemAuditLogs();
    const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
    const [selectedLogDetails, setSelectedLogDetails] = useState<
        | ({
            action?: string;
            userId?: string | { _id: string; name?: string; email?: string };
            targetId?: string | { _id: string; name?: string; code?: string; orderNumber?: string };
            targetType?: string;
            targetName?: string;
            timestamp?: string;
            createdAt?: string;
            changes: IAuditLogChange[];
        } | null)
        | null
    >(null);

    const queryParams = useMemo(() => {
        const params: { [key: string]: string | undefined } = {};

        switch (selectedFilter) {
            case "action":
                params.action = dSearch;
                break;
            case "userId":
                params.userId = dSearch;
                break;
            case "stockedItemId":
                params.stockedItemId = dSearch;
                break;
            case "itemId":
                params.itemId = dSearch;
                break;
            case "":
            default:
                params.search = dSearch;
                break;
        }
        return params;
    }, [selectedFilter, dSearch]);

    const { data: stockedItemMetrics, isLoading: isLoadingMetrics } = useQuery({
        queryKey: ["stockedItemAuditMetrics", queryParams],
        queryFn: () => getStockedItemAuditMetrics(queryParams),
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
        const option = STOCKED_ITEM_LOG_FILTER_OPTIONS.find(opt => opt.value === selectedFilter);

        if (option) {
            switch (option.value) {
                case "userId":
                case "stockedItemId":
                case "itemId":
                    return `Buscar por ${option.label.toLowerCase()}`;
                case "":
                    return 'Buscar termo geral...';
                default:
                    return `Buscar por ${option.label.toLowerCase()}`;
            }
        }
        return 'Buscar termo geral...';
    };

    const resolveUserIdDisplay = (
        userIdValue: unknown,
        _row: IGetAuditLogStockedItem
    ): ReactNode => {
        void _row;
        if (typeof userIdValue === 'object' && userIdValue !== null && '_id' in userIdValue) {
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

    const resolveStockedItemIdDisplay = (stockedItemIdValue: unknown, row: IGetAuditLogStockedItem): ReactNode => {
        void row;
        if (typeof stockedItemIdValue === 'object' && stockedItemIdValue !== null && '_id' in stockedItemIdValue) {
            const stockedItemObj = stockedItemIdValue as { _id: string; local?: string; quantity?: number; type?: string };
            return stockedItemObj._id ? stockedItemObj._id.substring(0, 8) + '...' : 'N/A';
        }
        if (typeof stockedItemIdValue === 'string' && stockedItemIdValue.match(/^[0-9a-fA-F]{24}$/)) {
            return stockedItemIdValue.substring(0, 8) + '...';
        }
        return String(stockedItemIdValue || 'N/A');
    };

    const resolveItemIdDisplay = (itemIdValue: unknown, row: IGetAuditLogStockedItem): ReactNode => {
        void row;
        if (typeof itemIdValue === 'object' && itemIdValue !== null && '_id' in itemIdValue) {
            const itemObj = itemIdValue as { _id: string; name?: string; sku?: string };
            return itemObj.name || itemObj.sku || (itemObj._id ? itemObj._id.substring(0, 8) + '...' : 'N/A');
        }
        if (typeof itemIdValue === 'string' && itemIdValue.match(/^[0-9a-fA-F]{24}$/)) {
            return itemIdValue.substring(0, 8) + '...';
        }
        return String(itemIdValue || 'N/A');
    };

    const formatActionForDisplay = (value: unknown): ReactNode => {
        const actionValue = typeof value === 'string' ? value : String(value);
        switch (actionValue) {
            case 'CREATE': return 'Criação';
            case 'UPDATE': return 'Atualização';
            case 'DELETE': return 'Exclusão';
            case 'INACTIVATE': return 'Inativação';
            case 'REACTIVATE': return 'Reativação';
            case 'TRANSFER_OUT': return 'Transferência (Saída)'; 
            case 'TRANSFER_IN_NEW': return 'Transferência (Nova Entrada)';
            case 'TRANSFER_IN_INCREMENT': return 'Transferência (Entrada p/ Existente)'; 
            case 'STORE_IN_LOCATION': return 'Estocagem Inicial'; 
            case 'QUANTITY_INCREMENT': return 'Quantidade Aumentada'; 
            case 'QUANTITY_DECREASE': return 'Quantidade Diminuída'; 
            case 'QUANTITY_ADJUSTMENT': return 'Ajuste de Quantidade'; 
            case 'QUANTITY_INCREASE': return 'Aumento Manual Quantidade';
            case 'NO_QUANTITY_CHANGE': return 'Sem Mudança Quantidade'; 
            case 'CONSOLIDATE_INACTIVATE': return 'Consolidação (Inativado)'; 
            case 'CONSOLIDATE_UPDATE': return 'Consolidação (Atualizado)'; 
            case 'QUANTITY_DEPLETED': return 'Quantidade Esgotada'; 
            default: return actionValue;
        }
    };

    const formatDateToDDMMYYYY = (value: unknown): ReactNode => {
        if (typeof value !== 'string' || !value) return "N/A";
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            return "Data Inválida";
        }
        return date.toLocaleDateString("pt-BR", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const handleViewChanges = (log: IGetAuditLogStockedItem) => {
        setSelectedLogDetails({
            action: log.action,
            userId: log.userId,
            targetId: log.stockedItemId,
            targetType: "StockedItem",
            targetName: log.itemName,
            timestamp: log.createdAt,
            createdAt: log.createdAt,
            changes: log.changes,
        });
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
                <Subtitle variant="large">Registros de Itens Estocados</Subtitle>
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
                            {STOCKED_ITEM_LOG_FILTER_OPTIONS.find((option) => option.value === selectedFilter)
                                ?.label || "Filtrar"}
                        </Caption>
                    </Button>

                    {showFilters && (
                        <FilterOptions
                            selectedFilter={selectedFilter}
                            onClose={toggleFilters}
                            onSelectFilter={handleSelectFilter}
                            filterOptions={STOCKED_ITEM_LOG_FILTER_OPTIONS}
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
                        icon={<LayoutGrid className="size-7" />}
                        title="Total de Registros de Itens Estocados"
                        value={(stockedItemMetrics && 'totalStockedItemLogs' in stockedItemMetrics) ? stockedItemMetrics.totalStockedItemLogs : 0}
                    />
                    <OverviewCard
                        icon={<Home className="size-7" />}
                        title="Novas Compras"
                        value={(stockedItemMetrics && 'newStockedItemCreatesMonth' in stockedItemMetrics) ? stockedItemMetrics.newStockedItemCreatesMonth : 0}
                    />
                    <OverviewCard
                        icon={<Package className="size-7" />}
                        title="Atualizações"
                        value={(stockedItemMetrics && 'updatedStockedItemsLastWeek' in stockedItemMetrics) ? stockedItemMetrics.updatedStockedItemsLastWeek : 0}
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
                            data={logs.data.map((log: IGetAuditLogStockedItem) => {
                                const displayUserId = resolveUserIdDisplay(log.userId, log);
                                const displayStockedItemId = resolveStockedItemIdDisplay(log.stockedItemId, log);
                                const displayItemId = resolveItemIdDisplay(log.itemId, log);
                                const formattedAction = formatActionForDisplay(log.action);
                                const formattedDate = formatDateToDDMMYYYY(log.createdAt);

                                return {
                                    ...log,
                                    action: formattedAction,
                                    userId: displayUserId,
                                    stockedItemId: displayStockedItemId,
                                    itemId: displayItemId,
                                    createdAt: formattedDate,
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
                                // { label: "Item Estocado", key: "stockedItemId" } as TableHeader,
                                // { label: "Item", key: "itemId" } as TableHeader,
                                { label: "Nome do Item", key: "itemName" } as TableHeader,
                                { label: "Quantidade", key: "quantity" } as TableHeader,
                                { label: "Tipo", key: "type" } as TableHeader,
                                { label: "Local", key: "local" } as TableHeader,
                                { label: "Data/Hora", key: "createdAt" } as TableHeader,
                                { label: "Detalhes", key: "changes", cellClassName: "w-10 text-center" } as TableHeader,
                            ]}
                            actionButton={false}
                            customMappings={{
                                action: { CREATE: "Criação", UPDATE: "Atualização", DELETE: "Exclusão", INACTIVATE: "Inativação", REACTIVATE: "Reativação" },
                                type: { unit: "Unidade", box: "Caixa" }
                            }}
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
                        <Subtitle variant="large" color="text-neutral-500">Nenhum Registro de item estocado encontrado.</Subtitle>
                    </div>
                )
            )}
        </div>
    );
}
