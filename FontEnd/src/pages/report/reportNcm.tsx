import { SpinningLogo } from "@/icons/SpinningLogo";
import { Pagination } from "@/ui/Pagination";
import { Table } from "@/ui/Table";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Input } from "@/ui/Input";
import { Search } from "@/icons/Search";
import { Button } from "@/ui/Button";
import { Caption } from "@/ui/typography/Caption";
import { ITEM_FILTER_OPTIONS } from "@/constants";
import { Filter } from "@/icons/Filter";
import { FilterOptions } from "@/components/FilterOptions";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { NcmModal } from "@/components/NcmModal";
import { putItemNcm } from "@/services/items";
import { toast } from "react-toastify";
import { IconButton } from "@/ui/IconButton";
import { ArrowBack } from "@/icons/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useReportItemsNcm } from "../report/useReportItemsNcm";

export default function ReportNcm() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [itemId, setItemId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [ncm, setNcm] = useState("");
  const [loadingNcm, setLoadingNcm] = useState(false);

  const [dSearch] = useDebounce(search, 500);
  const navigate = useNavigate();

  const { items, fetchItems, loading } = useReportItemsNcm();

  useEffect(() => {
    fetchItems({ param: selectedFilter, search: dSearch });
  }, [selectedFilter, dSearch, fetchItems]);

  const handlePageClick = (selected: number) => {
    fetchItems({
      page: selected,
      param: selectedFilter,
      search: dSearch,
    });
  };

  const toggleFilters = () => setShowFilters(!showFilters);
  const handleSelectFilter = (filter: string) => setSelectedFilter(filter);

  const handleActionChoice = (id: string) => id !== itemId && setItemId(id);

  const handleNcmChange = async () => {
    try {
      setLoadingNcm(true);
      const response = await putItemNcm(itemId, ncm);
      if (response.status === 200) {
        await fetchItems();
        return toast.success("NCM alterado com sucesso!", { theme: "colored" });
      }

      return toast.error(
        "Erro ao alterar NCM do item: " + response.data.message || response.data.error,
        {
          theme: "colored",
        }
      );
    } catch (error) {
      toast.error("Erro ao alterar NCM do item: " + error, {
        theme: "colored",
      });
    } finally {
      setLoadingNcm(false);
      setOpenModal(false);
      setItemId("");
      setNcm("");
    }
  };

  return (
    <div className="flex flex-col gap-6 py-sm px-sm sm:px-md bg-neutral-100 h-full">
      {!loadingNcm && (
        <NcmModal
          ncm={ncm}
          setNcm={setNcm}
          open={openModal}
          setOpen={setOpenModal}
          onConfirm={handleNcmChange}
        />
      )}

      <div className="flex items-center gap-3">
        <IconButton size="large" iconColor="#71717A" onClick={() => navigate("/report")}>
          <ArrowBack />
        </IconButton>
        <Subtitle variant="medium" color="text-neutral-500">
          Relatórios / Itens por NCM
        </Subtitle>
      </div>

      <div className="flex flex-col min-h-[50vh] gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
          <Subtitle variant="large-semibold" color="text-neutral-800">
            Itens por NCM
          </Subtitle>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-0 sm:gap-6">
            {showFilters && (
              <FilterOptions
                selectedFilter={selectedFilter}
                onClose={toggleFilters}
                onSelectFilter={handleSelectFilter}
                filterOptions={ITEM_FILTER_OPTIONS}
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
                {ITEM_FILTER_OPTIONS.find((option) => option.value === selectedFilter)
                  ?.label || "Filtrar"}
              </Caption>
            </Button>
          </div>
        </div>

        {loading || loadingNcm ? (
          <SpinningLogo />
        ) : (
          items && (
            <div className="max-w-[1500px] overflow-x-auto flex flex-col gap-6">
              <Table
                actionButton
                setSelectId={handleActionChoice}
                onDetail={setOpenModal}
                detailText="Alterar NCM"
                data={items.data}
                headers={[
                  { label: "Produto", key: "name" },
                  { label: "Nº Unidades", key: "totalUnit" },
                  { label: "Nº Caixas", key: "totalBox" },
                  { label: "NCM", key: "ncm" },
                  { label: "SKU", key: "sku" },
                  { label: "Custo médio", key: "avgCostPrice" },
                  { label: "Preço de venda", key: "price" },
                  { label: "Preço de atacado", key: "wholesalePrice" },
                  { label: "Preço de varejo", key: "retailPrice" },
                  { label: "Preço de promoção", key: "promotionPrice" },
                  { label: "Promoção ativa", key: "isPromotion" },
                ]}
                dateFields={["createdAt"]}
                imageField="imageUrl"
                monetaryFields={[
                  "avgCostPrice",
                  "price",
                  "wholesalePrice",
                  "retailPrice",
                  "promotionPrice",
                ]}
                customMappings={{
                  isPromotion: {
                    true: "Sim",
                    false: "Não",
                  },
                }}
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
