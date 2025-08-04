import { Add } from "@/icons/Add";
import { Search } from "@/icons/Search";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect, useState } from "react";
import { Table } from "@/ui/Table";
import { FormModal } from "@/ui/FormModal";
import { User } from "@/schemas/User";
import { UserEdit } from "@/schemas/UserEdit";
import { useUsers } from "@/hooks/useUsers";
import { IPostUser, IPutUser } from "@/types/user";
import { Pagination } from "@/ui/Pagination";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useDebounce } from "use-debounce";
import { RegisterTabs } from "./RegisterTabs";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { DEFAULT_USER_DATA } from "@/constants/index";

export default function Users() {
  const [nameOrEmail, setNameOrEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState<IPostUser>(DEFAULT_USER_DATA);
  const [editData, setEditData] = useState<IPutUser>(DEFAULT_USER_DATA);
  const [userId, setUserId] = useState("");
  const [editModal, setEditModal] = useState(false);

  const navigate = useNavigate();
  const { authorize } = useProfile();

  const {
    users,
    loading,
    addUser,
    removeUser,
    fetchUser,
    search,
    fetchUsers,
    updateUser,
  } = useUsers();

  const [dNameOrEmail] = useDebounce(nameOrEmail, 500);

  useEffect(() => {
    const fetchSearchedUsers = async () =>
      dNameOrEmail === "" ? fetchUsers() : await search(dNameOrEmail);

    fetchSearchedUsers();
  }, [dNameOrEmail]);

  const fetchAndSetUser = async (id: string) => {
    if (id) {
      const user = await fetchUser(id);
      const edited = {
        name: user.name,
        email: user.email,
        role: user.role,
      };
      setEditData(edited);
    }
  };

  const handleSubmit = () => {
    addUser(userData);
    setUserData(DEFAULT_USER_DATA);
    setOpenModal(false);
  };

  const handleEdit = () => {
    updateUser(userId, editData);
    setEditModal(false);
    setEditData({} as IPutUser);
  };

  const handleEditChoice = async () => {
    await fetchAndSetUser(userId);
    setEditModal(true);
  };

  const handleActionChoice = (id: string) => id !== userId && setUserId(id);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNameOrEmail(value);
  };

  const handlePageClick = (selected: number) => fetchUsers(selected);

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      {!loading && (
        <>
          <FormModal
            open={openModal}
            setOpen={setOpenModal}
            entity="usuário"
            mode="Criar"
            onSubmit={handleSubmit}
          >
            <User setUserData={setUserData} userData={userData} />
          </FormModal>
          <FormModal
            open={editModal}
            setOpen={setEditModal}
            entity="usuário"
            mode="Editar"
            onSubmit={handleEdit}
          >
            <UserEdit setUserData={setEditData} userData={editData} />
          </FormModal>
        </>
      )}

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between">
        <Subtitle variant="large">Cadastro</Subtitle>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-0 sm:gap-6">
          <Input
            data={nameOrEmail}
            onChange={handleSearch}
            icon={<Search />}
            iconPosition="left"
            wide
            className="bg-neutral-0 w-full"
          />
          {authorize("w_user") && (
            <Button
              variant="naked"
              color="default"
              className="border w-full"
              onClick={() => setOpenModal(true)}
            >
              <Add /> <Caption variant="large">Criar um usuário</Caption>
            </Button>
          )}
        </div>
      </div>

      <RegisterTabs />

      {loading ? (
        <SpinningLogo />
      ) : (
        users && (
          <>
            <Table
              actionButton
              data={users.data}
              headers={[
                { label: "Nome", key: "name" },
                { label: "E-mail", key: "email" },
                { label: "Cargo", key: "Roles" },
              ]}
              setSelectId={handleActionChoice}
              onDelete={authorize("d_user") ? () => removeUser(userId) : undefined}
              onEdit={authorize("u_user") ? handleEditChoice : undefined}
              deleteTitle="Você tem certeza que deseja excluir esse usuário?"
              deleteDescription="Ao excluir esse usuário não será possível recuperá-lo e ele não poderá acessar mais o sistema"
              onDetail={() => navigate(`/register/users/${userId}`)}
              detailText="Gerenciar cargos"
            />
            <Pagination
              currentPage={users.currentPage}
              totalItems={users.totalItems}
              totalPages={users.totalPages}
              limit={users.data.length}
              handlePageClick={handlePageClick}
            />
          </>
        )
      )}
    </div>
  );
}
