import { Search } from "@/icons/Search";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { Input } from "@/ui/Input";
import { Pagination } from "@/ui/Pagination";
import { Table } from "@/ui/Table";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { FilterOptions } from "@/components/FilterOptions";
import { StockTabs } from "./StockTabs";
import { useReservedItems } from "@/hooks/useReservedItems"; 
import { STOCKED_ITEM_FILTER_OPTIONS } from "@/constants";
import { Button } from "@/ui/Button";
import { Filter } from "@/icons/Filter";
import { Caption } from "@/ui/typography/Caption";
import { IGetStockedItemOverview } from "@/types/stockedItems";

export default function ReservedItems() {
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [dSearch] = useDebounce(search, 500);
    const {
        reservedItems, 
        fetchReservedItems, 
        loading,
    } = useReservedItems(); 

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    useEffect(() => {

        fetchReservedItems({
            param: selectedFilter,
            search: dSearch,
        });
    }, [selectedFilter, dSearch, fetchReservedItems]);


    const handlePageClick = (page: number) => {

        fetchReservedItems({
            page,
            param: selectedFilter,
            search: dSearch,
        });
    };

    const toggleFilters = () => setShowFilters(!showFilters);
    const handleSelectFilter = (filter: string) => setSelectedFilter(filter);

    return (
        <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
                <Subtitle variant="large">Itens Reservados</Subtitle>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-0 sm:gap-6">
                    {showFilters && (
                        <FilterOptions
                            selectedFilter={selectedFilter}
                            onClose={toggleFilters}
                            onSelectFilter={handleSelectFilter}
                            filterOptions={STOCKED_ITEM_FILTER_OPTIONS.filter(option => option.value !== "type")}
                        />
                    )}

                    {selectedFilter !== "" && (
                        <Input
                            data={search}
                            onChange={handleSearch}
                            icon={<Search />}
                            iconPosition="left"
                            wide
                            className="bg-neutral-0 w-full"
                        />
                    )}

                    <Button
                        variant="naked"
                        color="default"
                        className="border"
                        onClick={toggleFilters}
                    >
                        <Filter />
                        <Caption variant="large">
                            {STOCKED_ITEM_FILTER_OPTIONS.find(
                                (option) => option.value === selectedFilter
                            )?.label || "Filtrar"}
                        </Caption>
                    </Button>
                </div>
            </div>

            <StockTabs />

            {loading ? (
                <SpinningLogo />
            ) : (
                reservedItems && (
                    <>
                        <Table
                            data={reservedItems.data as IGetStockedItemOverview[]}
                            headers={[
                                { label: "Item", key: "name" },
                                {
                                    label: "Caixas Reservadas",
                                    key: "reservedQuantityBox",
                                },
                                {
                                    label: "Unidades Reservadas",
                                    key: "reservedQuantityUnit",
                                },
                                {
                                    label: "Caixas Disponíveis",
                                    key: "availableQuantityBox",
                                },
                                {
                                    label: "Unidades Disponíveis",
                                    key: "availableQuantityUnit",
                                },
                                { label: "Itens por caixa", key: "quantityBox" },
                            ]}
                            imageField="imageUrl"
                        />
                        <Pagination
                            currentPage={reservedItems.currentPage}
                            totalItems={reservedItems.totalItems}
                            totalPages={reservedItems.totalPages}
                            limit={reservedItems.data.length}
                            handlePageClick={handlePageClick}
                        />
                    </>
                )
            )}
        </div>
    );
}