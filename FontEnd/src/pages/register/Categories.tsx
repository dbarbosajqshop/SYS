import { Add } from "@/icons/Add";
import { Search } from "@/icons/Search";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState } from "react";
import { Table } from "@/ui/Table";
import { FormModal } from "@/ui/FormModal";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { IPostCategory } from "@/types/categories";
import { useCategories } from "@/hooks/useCategories";
import { useCreateCategory } from "@/hooks/useCreateCategory";
import { Category } from "@/schemas/Category";
import { RegisterTabs } from "./RegisterTabs";
import { useProfile } from "@/hooks/useProfile";

export default function Categories() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [categoryData, setCategoryData] = useState<IPostCategory>({} as IPostCategory);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [editData, setEditData] = useState<IPostCategory>({} as IPostCategory);
  const [categoryId, setcategoryId] = useState("");
  const [editModal, setEditModal] = useState(false);

  const { authorize } = useProfile();

  const [dSearch] = useDebounce(search, 500);

  const {
    categories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    removeCategory,
    fetchCategory,
  } = useCategories();

  const fetchAndSetCategory = async (id: string) => {
    if (id && categories) {
      const category = await fetchCategory(id);
      const edited = {
        name: category?.name,
        description: category?.description,
        commission: category?.commission.toString().replace(".", ",") || 0,
      };
      setEditData(edited);
    }
  };

  const { handleSubmit } = useCreateCategory(
    categoryData,
    setCategoryData,
    addCategory,
    setErrors,
    setOpenModal
  );

  const handleEdit = () => {
    const editDataFormatted = {
      ...editData,
      commission: Number(editData.commission?.toString().replace(",", ".")),
    };
    updateCategory(categoryId, editDataFormatted);

    setEditModal(false);
    setEditData({} as IPostCategory);
  };

  const handleEditChoice = async () => {
    await fetchAndSetCategory(categoryId);
    setEditModal(true);
  };

  const handleActionChoice = (id: string) => id !== categoryId && setcategoryId(id);

  const handlePageClick = (page: number) => {
    fetchCategories({
      page,
      search: dSearch,
    });
  };

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      {!loading && (
        <>
          <FormModal
            open={openModal}
            setOpen={setOpenModal}
            entity="categoria"
            mode="Criar"
            onSubmit={handleSubmit}
          >
            <Category
              setCategoryData={setCategoryData}
              categoryData={categoryData}
              errors={errors}
            />
          </FormModal>

          <FormModal
            open={editModal}
            setOpen={setEditModal}
            entity="categoria"
            mode="Editar"
            onSubmit={handleEdit}
          >
            <Category
              setCategoryData={setEditData}
              categoryData={editData}
              errors={errors}
            />
          </FormModal>
        </>
      )}

      <div className="flex flex-wrap sm:flex-nowrap categories-center justify-between">
        <Subtitle variant="large">Cadastro</Subtitle>
        <div className="flex flex-wrap sm:flex-nowrap categories-center gap-0 sm:gap-6">
          <Input
            data={search}
            onChange={({ target }) => setSearch(target.value)}
            icon={<Search />}
            iconPosition="left"
            wide
            className="bg-neutral-0 -my-2.5 w-full"
          />
          {authorize("w_category") && (
            <Button
              variant="naked"
              color="default"
              className="border  w-full"
              onClick={() => setOpenModal(true)}
            >
              <Add /> <Caption variant="large">Criar Categoria</Caption>
            </Button>
          )}
        </div>
      </div>
      <RegisterTabs />

      {loading ? (
        <SpinningLogo />
      ) : (
        categories && (
          <>
            <Table
              actionButton
              data={categories.data}
              headers={[
                { label: "Nome", key: "name" },
                { label: "Descrição", key: "description" },
                { label: "Comissão", key: "commission" },
              ]}
              percentageFields={["commission"]}
              setSelectId={handleActionChoice}
              onDelete={
                authorize("d_category") ? () => removeCategory(categoryId) : undefined
              }
              onEdit={authorize("u_category") ? handleEditChoice : undefined}
              deleteTitle="Você tem certeza que deseja excluir esse estoque?"
              deleteDescription="Ao excluir esse estoque não será possível recupera-lo e nem os itens anexados a ele"
            />
            <Pagination
              currentPage={categories.currentPage}
              totalItems={categories.totalItems}
              totalPages={categories.totalPages}
              limit={categories.data.length}
              handlePageClick={handlePageClick}
            />
          </>
        )
      )}
    </div>
  );
}
