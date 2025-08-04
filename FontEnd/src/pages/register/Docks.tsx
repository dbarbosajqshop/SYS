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
import { useDocks } from "@/hooks/useDocks";
import { IPostDock } from "@/types/docks";
import { useCreateDock } from "@/hooks/useCreateDock";
import { Dock } from "@/schemas/Dock";
import { RegisterTabs } from "./RegisterTabs";
import { useProfile } from "@/hooks/useProfile";

export default function Docks() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [dockData, setDockData] = useState<IPostDock>({} as IPostDock);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [editData, setEditData] = useState<IPostDock>({} as IPostDock);
  const [dockId, setDockId] = useState("");
  const [editModal, setEditModal] = useState(false);

  const [dSearch] = useDebounce(search, 500);

  const { authorize } = useProfile();

  const { docks, loading, fetchDocks, addDock, updateDock, removeDock, fetchDock } =
    useDocks();

  const fetchAndSetDock = async (id: string) => {
    if (id && docks) {
      const dock = await fetchDock(id);
      const edited = {
        code: dock?.code,
      };
      setEditData(edited);
    }
  };

  const { handleSubmit } = useCreateDock(
    dockData,
    setDockData,
    addDock,
    setErrors,
    setOpenModal
  );

  const handleEdit = () => {
    updateDock(dockId, editData);

    setEditModal(false);
    setEditData({} as IPostDock);
  };

  const handleEditChoice = async () => {
    await fetchAndSetDock(dockId);
    setEditModal(true);
  };

  const handleActionChoice = (id: string) => id !== dockId && setDockId(id);

  const handlePageClick = (page: number) => {
    fetchDocks({
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
            entity="doca"
            mode="Criar"
            onSubmit={handleSubmit}
          >
            <Dock setDockData={setDockData} dockData={dockData} errors={errors} />
          </FormModal>

          <FormModal
            open={editModal}
            setOpen={setEditModal}
            entity="doca"
            mode="Editar"
            onSubmit={handleEdit}
          >
            <Dock setDockData={setEditData} dockData={editData} errors={errors} />
          </FormModal>
        </>
      )}

      <div className="flex flex-wrap sm:flex-nowrap docks-center justify-between">
        <Subtitle variant="large">Cadastro</Subtitle>
        <div className="flex flex-wrap sm:flex-nowrap docks-center gap-0 sm:gap-6">
          <Input
            data={search}
            onChange={({ target }) => setSearch(target.value)}
            icon={<Search />}
            iconPosition="left"
            wide
            className="bg-neutral-0 -my-2.5 w-full"
          />
          {authorize("w_dock") && (
            <Button
              variant="naked"
              color="default"
              className="border w-full"
              onClick={() => setOpenModal(true)}
            >
              <Add /> <Caption variant="large">Criar Doca</Caption>
            </Button>
          )}
        </div>
      </div>

      <RegisterTabs />

      {loading ? (
        <SpinningLogo />
      ) : (
        docks && (
          <>
            <Table
              actionButton
              data={docks.data}
              headers={[{ label: "Código da Doca", key: "code" }]}
              setSelectId={handleActionChoice}
              onDelete={authorize("d_dock") ? () => removeDock(dockId) : undefined}
              onEdit={authorize("u_dock") ? handleEditChoice : undefined}
              deleteTitle="Você tem certeza que deseja excluir essa Doca?"
              deleteDescription="Ao excluir esse estoque não será possível recupera-lo e nem os itens anexados a ele"
            />
            <Pagination
              currentPage={docks.currentPage}
              totalItems={docks.totalItems}
              totalPages={docks.totalPages}
              limit={docks.data.length}
              handlePageClick={handlePageClick}
            />
          </>
        )
      )}
    </div>
  );
}
