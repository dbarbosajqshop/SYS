import { Add } from "@/icons/Add";
import { Search } from "@/icons/Search";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect, useState } from "react";
import { Table } from "@/ui/Table";
import { FormModal } from "@/ui/FormModal";
import { Item as ItemForm } from "@/schemas/Item"; 
import { Filter } from "@/icons/Filter";
import { IPostItem, IPutItem } from "@/types/items";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useItems } from "@/hooks/useItems";
import { VisualizeModal } from "@/ui/VisualizeModal";
import { ItemVisualize } from "@/schemas/ItemVisualize";
import { useCreateItem } from "@/hooks/useCreateItem";
import { useDebounce } from "use-debounce";
import { FilterOptions } from "@/components/FilterOptions";
import { DEFAULT_ITEM_DATA, ITEM_FILTER_OPTIONS } from "@/constants";
import { RegisterTabs } from "./RegisterTabs";
import { useProfile } from "@/hooks/useProfile";
import { ImageUploadModal } from "@/components/ImageUploadModal"; 

export default function Items() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [itemData, setItemData] = useState<IPostItem>(DEFAULT_ITEM_DATA);
  const [itemPhoto, setItemPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [editData, setEditData] = useState<IPutItem>({} as IPutItem);
  const [itemId, setItemId] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [visualizeModal, setVisualizeModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [imageEditModal, setImageEditModal] = useState(false); 
  const { authorize } = useProfile(); 
  const [dSearch] = useDebounce(search, 500);
  const {
    items,
    loading,
    addItem,
    removeItem,
    fetchItem,
    fetchItems,
    updateItem,
    savePhoto,
  } = useItems();

  useEffect(() => {
    if (!editModal && !imageEditModal) setItemPhoto(null); 
  }, [editModal, imageEditModal]);

  useEffect(() => {
    fetchItems({ param: selectedFilter, search: dSearch });
  }, [selectedFilter, dSearch]);

  const fetchAndSetItem = async (id: string) => {
    if (id) {
      const item = await fetchItem(id);
      setItemPhoto(null); 
      setEditData({
        ...item,
        upcList: item.upcList ?? [],
      });
    }
  };
  const { handleSubmit } = useCreateItem(
    itemData,
    setItemData,
    addItem,
    setErrors,
    setOpenModal,
    itemPhoto,
    savePhoto
  );
  const handleEdit = () => {
    const formatedData = {
      ...editData,
      price: Number(editData.price.toString().replace(",", ".")),
      promotionPrice: Number(editData?.promotionPrice?.toString().replace(",", ".")),
      wholesalePrice: Number(editData?.wholesalePrice?.toString().replace(",", ".")),
      retailPrice: Number(editData?.retailPrice?.toString().replace(",", ".")),
    };
    updateItem(itemId, formatedData);
    if (itemPhoto) savePhoto(itemId, itemPhoto);

    setEditModal(false);
    setItemPhoto(null); 
    setEditData(DEFAULT_ITEM_DATA); 
  };
  const handleImageSave = async () => {
    if (itemId && itemPhoto) {
      await savePhoto(itemId, itemPhoto);
      setImageEditModal(false);
      setItemPhoto(null); 
      fetchItems({ param: selectedFilter, search: dSearch }); 
    }
  };
  const handleEditChoice = async () => {
    await fetchAndSetItem(itemId);
    if (authorize("u_items")) {
      setEditModal(true);
    } else if (authorize("u_items_photo")) {
      setImageEditModal(true);
    }
  };
  const handleActionChoice = (id: string) => id !== itemId && setItemId(id);
  const handleVisualizeChoice = async () => {
    await fetchAndSetItem(itemId);
    setVisualizeModal(true);
  };
  const handlePageClick = (selected: number) => {
    fetchItems({
      page: selected,
      param: selectedFilter,
      search: dSearch,
    });
  };
  const toggleFilters = () => setShowFilters(!showFilters);
  const handleSelectFilter = (filter: string) => setSelectedFilter(filter);
  const getEditAction = () => {
    if (authorize("u_items") || authorize("u_items_photo")) {
      return handleEditChoice; 
    }
    return undefined; 
  };

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      {!loading && (
        <>
          {authorize("w_items") && (
            <FormModal
              open={openModal}
              setOpen={setOpenModal}
              entity="item"
              mode="Criar"
              onSubmit={handleSubmit}
            >
              <ItemForm
                setItemData={setItemData}
                itemData={itemData}
                itemPhoto={itemPhoto}
                setItemPhoto={setItemPhoto}
                errors={errors}
              />
            </FormModal>
          )}

          {authorize("u_items") && (
            <FormModal
              open={editModal}
              setOpen={setEditModal}
              entity="estoque" 
              mode="Editar"
              onSubmit={handleEdit}
            >
              <ItemForm
                setItemData={setEditData}
                itemData={editData}
                itemPhoto={itemPhoto}
                setItemPhoto={setItemPhoto}
                errors={errors}
              />
            </FormModal>
          )}

          {/* Renderize o modal de upload de imagem se o usuário tiver permissão 'u_items_photo' */}
          {authorize("u_items_photo") && (
            <ImageUploadModal
              open={imageEditModal}
              setOpen={setImageEditModal}
              itemPhoto={itemPhoto}
              setItemPhoto={setItemPhoto}
              onSave={handleImageSave}
              imageUrl={editData.imageUrl} 
            />
          )}
        </>
      )}

      {/* Renderizar VisualizeModal apenas se o usuário tiver permissão para visualizar itens */}
      {authorize("r_items") && (
        <VisualizeModal
          open={visualizeModal}
          setOpen={setVisualizeModal}
          entity="item"
          onEdit={handleEditChoice}
        >
          <ItemVisualize itemData={editData} />
        </VisualizeModal>
      )}

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Cadastro</Subtitle>
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

          {authorize("w_items") && (
            <Button
              variant="naked"
              color="default"
              className="border w-full"
              onClick={() => setOpenModal(true)}
            >
              <Add /> <Caption variant="large">Criar Item</Caption>
            </Button>
          )}
        </div>
      </div>

      <RegisterTabs />

      {loading ? (
        <SpinningLogo />
      ) : (
        items && authorize("r_items") && (
          <>
            <Table
              actionButton
              data={items.data}
              headers={[
                { label: "Item", key: "name" },
                { label: "Categoria", key: "category.name" },
                { label: "Preço", key: "price" },
                { label: "Qntd. de itens por caixa", key: "quantityBox" },
                { label: "SKU", key: "sku" },
              ]}
              imageField="imageUrl"
              monetaryFields={["price"]}
              setSelectId={handleActionChoice}
              onDelete={authorize("d_items") ? () => removeItem(itemId) : undefined}
              onEdit={getEditAction()} 
              onDetail={authorize("r_items") ? handleVisualizeChoice : undefined}
              deleteTitle="Você tem certeza que deseja excluir esse estoque?"
              deleteDescription="Ao excluir esse estoque não será possível recupera-lo e nem os itens anexados a ele"
              editLabel={authorize("u_items_photo") && !authorize("u_items") ? "Alterar Imagem" : "Editar"}
            />
            <Pagination
              currentPage={items.currentPage}
              totalItems={items.totalItems}
              totalPages={items.totalPages}
              limit={items.data.length}
              handlePageClick={handlePageClick}
            />
          </>
        )
      )}
    </div>
  );
};