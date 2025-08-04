import { useStockedItems } from "@/hooks/useStockedItems";
import { Filter } from "@/icons/Filter";
import { Search } from "@/icons/Search";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { StockedItem } from "@/schemas/StockedItem";
import { IGetStockedItem, ITransferStockedItem } from "@/types/stockedItems";
import { Button } from "@/ui/Button";
import { FormModal } from "@/ui/FormModal";
import { Input } from "@/ui/Input";
import { Pagination } from "@/ui/Pagination";
import { Table } from "@/ui/Table";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  DEFAULT_STOCKED_ITEM_DATA,
  STOCKED_ITEM_FILTER_OPTIONS,
  TYPE_UNIT_OPTIONS,
} from "@/constants";
import { useDebounce } from "use-debounce";
import { FilterOptions } from "@/components/FilterOptions";
import { StockTabs } from "./StockTabs";
import { useProfile } from "@/hooks/useProfile";
import { QuantityModal } from "@/components/QuantityModal";
import { Select } from "@/ui/Select";

export default function Items() {
  const [search, setSearch] = useState("");
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IGetStockedItem>(
    {} as IGetStockedItem
  );
  const [purchaseId, setPurchaseId] = useState("");
  const [stockedItemData, setStockedItemData] = useState<ITransferStockedItem>(
    DEFAULT_STOCKED_ITEM_DATA
  );
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [openQuantityModal, setOpenQuantityModal] = useState(false);
  const [quantity, setQuantity] = useState("");

  const [type, setType] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [dSearch] = useDebounce(search, 500);

  const { authorize } = useProfile();

  const {
    stockedItems,
    fetchStockedItems,
    newLocal,
    transferItem,
    loading,
    updateQuantity,
  } = useStockedItems();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setHasSearched(true);
  };

  useEffect(() => {
    if (hasSearched || dSearch.length > 0 || selectedFilter === "type")
      fetchStockedItems({
        param: selectedFilter,
        search: selectedFilter === "type" ? type : dSearch,
      });
  }, [selectedFilter, dSearch, type]);

  const handleActionChoice = (id: string) => id !== purchaseId && setPurchaseId(id);

  const handleTransfer = (item: IGetStockedItem) => {
    if (item.type === "unit")
      return toast.info("Não é possível transferir unidades", { theme: "colored" });

    setSelectedItem(item);
    setOpenTransferModal(true);
  };

  const handleChangeQuantity = (item: IGetStockedItem) => {
    setSelectedItem(item);
    setOpenQuantityModal(true);
  };

  const handleChangeLocal = async () => {
    if (selectedItem && stockedItemData.local !== "Sem local")
      await transferItem(selectedItem._id, stockedItemData);
    else await newLocal(selectedItem._id, stockedItemData);
    setOpenTransferModal(false);
    setStockedItemData(DEFAULT_STOCKED_ITEM_DATA);
  };

  const handlePageClick = (page: number) => {
    fetchStockedItems({
      page,
      param: selectedFilter,
      search: selectedFilter === "type" ? type : dSearch,
    });
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleSelectFilter = (filter: string) => setSelectedFilter(filter);

  return (
    <>
      {!loading && (
        <>
          <FormModal
            entity="Transferência"
            mode="Movimentar"
            open={openTransferModal}
            setOpen={setOpenTransferModal}
            onSubmit={handleChangeLocal}
          >
            <StockedItem
              selectStockedItem={selectedItem}
              stockedItemData={stockedItemData}
              setStockedItemData={setStockedItemData}
            />
          </FormModal>
          <QuantityModal
            title="Defina a nova quantidade"
            quantity={quantity}
            open={openQuantityModal}
            setOpen={setOpenQuantityModal}
            setQuantity={setQuantity}
            onConfirm={() => {
              updateQuantity(purchaseId, Number(quantity));
              setOpenQuantityModal(false);
              setQuantity("");
            }}
          />
        </>
      )}

      <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
          <Subtitle variant="large">Estoque</Subtitle>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-0 sm:gap-6">
            {showFilters && (
              <FilterOptions
                selectedFilter={selectedFilter}
                onClose={toggleFilters}
                onSelectFilter={handleSelectFilter}
                filterOptions={STOCKED_ITEM_FILTER_OPTIONS}
              />
            )}

            {selectedFilter === "type" ? (
              <Select
                data={type}
                options={TYPE_UNIT_OPTIONS}
                onChange={(option) => setType(option.target.value)}
              />
            ) : (
              selectedFilter !== "" && (
                <Input
                  data={search}
                  onChange={handleSearch}
                  icon={<Search />}
                  iconPosition="left"
                  wide
                  className="bg-neutral-0 w-full"
                />
              )
            )}
            <Button
              variant="naked"
              color="default"
              className="border"
              onClick={toggleFilters}
            >
              <Filter />{" "}
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
          stockedItems && (
            <>
              <Table
                actionButton
                transferButton={authorize("u_stocked_item")}
                data={stockedItems.data}
                headers={[
                  { label: "Item", key: "name" },
                  { label: "Quantidade", key: "quantity" },
                  { label: "Tipo", key: "type" },
                  { label: "Nº de itens por caixa", key: "quantityBox" },
                  { label: "Local", key: "local" },
                ]}
                imageField="imageUrl"
                customMappings={{
                  type: {
                    box: "Caixas",
                    unit: "Unidades",
                  },
                }}
                onDetail={handleChangeQuantity}
                detailText="Alterar quantidade"
                setSelectId={handleActionChoice}
                onTransfer={authorize("u_stocked_item") ? handleTransfer : undefined}
              />
              <Pagination
                currentPage={stockedItems.currentPage}
                totalItems={stockedItems.totalItems}
                totalPages={stockedItems.totalPages}
                limit={stockedItems.data.length}
                handlePageClick={handlePageClick}
              />
            </>
          )
        )}
      </div>
    </>
  );
}
