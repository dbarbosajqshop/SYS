import { SpinningLogo } from "@/icons/SpinningLogo";
import { Pagination } from "@/ui/Pagination";
import { Table } from "@/ui/Table";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Input } from "@/ui/Input";
import { Search } from "@/icons/Search";
import { Button } from "@/ui/Button";
import { Caption } from "@/ui/typography/Caption";
import { ITEM_COST_OPTIONS } from "@/constants";
import { Filter } from "@/icons/Filter";
import { FilterOptions } from "@/components/FilterOptions";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { useReportCost } from "./useReportCost";
import { CostChart } from "./components/CostChart";
import { IGetItemCost } from "@/types/items";
import { IconButton } from "@/ui/IconButton";
import { ArrowBack } from "@/icons/ArrowBack";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "@/helpers"; 

const { RangePicker } = DatePicker;

export default function ReportCost() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [dSearch] = useDebounce(search, 500);
  const navigate = useNavigate();

  const { items, fetchItems, loading } = useReportCost();

  useEffect(() => {
    fetchItems({ param: selectedFilter, search: dSearch, startDate, endDate });
  }, [selectedFilter, dSearch, startDate, endDate, fetchItems]);

  const handlePageClick = (selected: number) => {
    fetchItems({
      page: selected,
      param: selectedFilter,
      search: dSearch,
      startDate,
      endDate,
    });
  };

  const toggleFilters = () => setShowFilters(!showFilters);
  const handleSelectFilter = (filter: string) => setSelectedFilter(filter);
  const totalQuantitySold = items?.totalSoldSum ?? 0;
  const totalRevenueSold = items?.totalRevenueSum ?? 0;

  return (
    <div className="flex flex-col gap-6 py-sm px-sm sm:px-md bg-neutral-100 h-full">
      <div className="flex items-center gap-3">
        <IconButton
          size="large"
          iconColor="#71717A"
          onClick={() => navigate("/report")}
        >
          <ArrowBack />
        </IconButton>
        <Subtitle variant="medium" color="text-neutral-500">
          Relatórios / Custo por item
        </Subtitle>
      </div>

      <div className="flex flex-col min-h-[50vh] gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
        <CostChart items={items?.data as unknown as IGetItemCost[]} loading={loading} />
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
          <Subtitle variant="large-semibold" color="text-neutral-800">
            Custo por item
          </Subtitle>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-0 sm:gap-6">
            <RangePicker
              className="h-12 w-full"
              format={"DD/MM/YYYY"}
              onChange={(_dates, dateStrings) => {
                setStartDate(dateStrings[0]);
                setEndDate(dateStrings[1]);
              }}
            />
            {showFilters && (
              <FilterOptions
                selectedFilter={selectedFilter}
                onClose={toggleFilters}
                onSelectFilter={handleSelectFilter}
                filterOptions={ITEM_COST_OPTIONS}
              />
            )}
            {selectedFilter && (
              <Input
                data={search}
                onChange={({ target }) => setSearch(target.value)}
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
              <Filter />{" "}
              <Caption variant="large">
                {ITEM_COST_OPTIONS.find((option) => option.value === selectedFilter)
                  ?.label || "Filtrar"}
              </Caption>
            </Button>
          </div>
        </div>

        {loading ? (
          <SpinningLogo />
        ) : (
          items && (
            <div className="overflow-x-auto flex flex-col gap-6">
              <Table
                data={items.data}
                headers={[
                  { label: "Produto", key: "name" },
                  { label: "SKU", key: "sku" },
                  { label: "NCM", key: "ncm" },
                  { label: "Custo médio", key: "avgCostPrice" },
                  { label: "Venda média", key: "avgSalePrice" },
                  { label: "Lucro médio", key: "avgProfit" },
                  { label: "Valor total vendido", key: "totalRevenue" },
                  { label: "Quantidade total vendida", key: "totalSold" },
                ]}
                monetaryFields={[
                  "avgCostPrice",
                  "avgSalePrice",
                  "avgProfit",
                  "totalRevenue",
                ]}
                dateFields={["createdAt"]}
                imageField="imageUrl"
                footerContent={
                  <tr>
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2 text-left"> 
                      <Caption variant="large-semibold">Total Geral:</Caption>
                    </td>
                    <td className="px-3 py-2 text-left"> 
                      <Caption variant="large-semibold">
                        {formatMoney(totalRevenueSold)}
                      </Caption>
                    </td>
                    <td className="px-3 py-2 text-left"> 
                      <Caption variant="large-semibold">
                        {totalQuantitySold.toLocaleString("pt-BR")}
                      </Caption>
                    </td>
                  </tr>
                }
              />
              <Pagination
                currentPage={items.currentPage}
                totalItems={items.totalItems}
                totalPages={items.totalPages}
                limit={items.data.length}
                handlePageClick={handlePageClick}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}