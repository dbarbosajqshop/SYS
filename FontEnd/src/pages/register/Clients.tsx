import { Add } from "@/icons/Add";
import { Search } from "@/icons/Search";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useState, useEffect } from "react";
import { Table } from "@/ui/Table";
import { FormModal } from "@/ui/FormModal";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { useClients } from "@/hooks/useClients";
import { Client } from "@/schemas/Client";
import { IPostClient } from "@/types/client";
import { useCreateClient } from "@/hooks/useCreateClient";
import { VoucherModal } from "@/components/VoucherModal";
import { RegisterTabs } from "./RegisterTabs";
import { useProfile } from "@/hooks/useProfile";

export default function Clients() {
  const [clientData, setClientData] = useState<IPostClient>({} as IPostClient);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<IPostClient>({} as IPostClient);
  const [userId, setUserId] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [openVoucherModal, setOpenVoucherModal] = useState(false);
  const [clientVoucher, setClientVoucher] = useState("");

  const { authorize } = useProfile();

  const [dSearch] = useDebounce(search, 500);

  const {
    clients,
    fetchClients,
    fetchClient,
    removeClient,
    addClient,
    updateClient,
    loading,
    newVoucher,
  } = useClients();

  const { handleSubmit } = useCreateClient(
    clientData,
    setClientData,
    addClient,
    setErrors,
    setOpenModal
  );

  useEffect(() => {
    fetchClients({ page: 1, client: dSearch });
  }, [dSearch]);

  const fetchAndSetUser = async (id: string) => {
    if (id) {
      const client = await fetchClient(id);
      const edited = {
        name: client.name,
        email: client.email,
        cpf: client.cpf,
        telephoneNumber: client.telephoneNumber,
        address: {
          street: client.address.street,
          number: client.address.number,
          neighborhood: client.address.neighborhood,
          city: client.address.city,
          complement: client.address.complement,
          state: client.address.state,
          zip: client.address.zip,
        },
      };
      setEditData(edited);
    }
  };

  const handleEdit = () => {
    updateClient(userId, editData);
    setEditModal(false);
    setEditData({} as IPostClient);
  };

  const handleEditChoice = async () => {
    await fetchAndSetUser(userId);
    setEditModal(true);
  };

  const handleActionChoice = (id: string) => id !== userId && setUserId(id);

  const handlePageClick = (selected: number) =>
    fetchClients({ page: selected, client: dSearch });

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      {!loading && (
        <>
          <FormModal
            open={openModal}
            setOpen={setOpenModal}
            entity="cliente"
            mode="Criar"
            onSubmit={handleSubmit}
          >
            <Client
              clientData={clientData}
              setClientData={setClientData}
              erros={errors}
            />
          </FormModal>

          <FormModal
            open={editModal}
            setOpen={setEditModal}
            entity="cliente"
            mode="Editar"
            onSubmit={handleEdit}
          >
            <Client clientData={editData} setClientData={setEditData} erros={errors} />
          </FormModal>
        </>
      )}

      <VoucherModal
        open={openVoucherModal}
        setOpen={setOpenVoucherModal}
        clientVoucher={clientVoucher}
        setClientVoucher={setClientVoucher}
        clientId={userId}
        addVoucher={newVoucher}
      />

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Cadastro</Subtitle>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-0 sm:gap-6">
          <Input
            data={search}
            onChange={({ target }) => setSearch(target.value)}
            icon={<Search />}
            iconPosition="left"
            wide
            className="bg-neutral-0 w-full"
          />
          {authorize("w_client") && (
            <Button
              variant="naked"
              color="default"
              className="border w-full"
              onClick={() => setOpenModal(true)}
            >
              <Add /> <Caption variant="large">Criar um cliente</Caption>
            </Button>
          )}
        </div>
      </div>

      <RegisterTabs />

      {loading ? (
        <SpinningLogo />
      ) : (
        clients && (
          <>
            <Table
              actionButton
              data={clients.data}
              headers={[
                { label: "Nome", key: "name" },
                { label: "E-mail", key: "email" },
              ]}
              setSelectId={handleActionChoice}
              onDelete={authorize("d_client") ? () => removeClient(userId) : undefined}
              onEdit={authorize("u_client") ? handleEditChoice : undefined}
              onVoucher={() => setOpenVoucherModal(true)}
              deleteTitle="Você tem certeza que deseja excluir esse cliente?"
              deleteDescription="Ao excluir esse cliente não será possível recuperá-lo e ele não poderá acessar mais o sistema"
            />
            <Pagination
              currentPage={clients.currentPage}
              totalItems={clients.totalItems}
              totalPages={clients.totalPages}
              limit={clients.data.length}
              handlePageClick={handlePageClick}
            />
          </>
        )
      )}
    </div>
  );
}
