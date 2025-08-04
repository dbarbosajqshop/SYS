import { ArrowBack } from "@/icons/ArrowBack";
import { IconButton } from "@/ui/IconButton";
import { Caption } from "@/ui/typography/Caption";
import { Paragraph } from "@/ui/typography/Paragraph";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Subtitle } from "@/ui/typography/Subtitle";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { useUsers } from "@/hooks/useUsers";
import { Heading } from "@/ui/typography/Heading";
import { IGetUser } from "@/types/user";
import { useRoles } from "@/hooks/useRoles";
import { Button } from "@/ui/Button";
import { IGetRole } from "@/types/roles";
import { toast } from "react-toastify";

export default function UserRoles() {
  const [userData, setUserData] = useState<IGetUser>();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { fetchUser, loading } = useUsers();
  const { rolesList, updateUserRoles, loading: loadingRoles } = useRoles();

  const fetchUserData = async () => {
    const user = await fetchUser(location.pathname.split("/")[3]);
    setUserData(user);
    fetchRoles();
  };

  const fetchRoles = async () => {
    if (!userData) return;
    const roles = (userData.Roles as IGetRole[]).map((role) => role._id);
    setSelectedRoles(roles);
  };

  useEffect(() => {
    fetchUserData();
  }, [location.pathname]);

  useEffect(() => {
    if (!isEditing) fetchRoles();
  }, [userData, isEditing]);

  const handleSave = async () => {
    try {
      if (selectedRoles.length === 0)
        return toast.error("Selecione ao menos um cargo", { theme: "colored" });
      await updateUserRoles(userData?._id as string, selectedRoles);
      setIsEditing(false);
      await fetchUserData();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unexpected error occurred", { theme: "colored" });
      }
    }
  };

  if (loading) return <SpinningLogo />;

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      <div className="flex items-center">
        <IconButton
          size="large"
          iconColor="#71717A"
          onClick={() => navigate("/register/users")}
        >
          <ArrowBack />
        </IconButton>
        <Caption variant="large" color="text-neutral-500">
          {`Usuários / ${userData?.name}`}
        </Caption>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
        <div className="w-full">
          <Paragraph variant="large" color="text-neutral-500">
            Usuário:
          </Paragraph>
          <Subtitle variant="large">{userData?.name}</Subtitle>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Heading variant="medium">Cargos</Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loadingRoles ? (
            <SpinningLogo />
          ) : (
            rolesList.map((role) => (
              <label className="flex items-center justify-between w-full py-xxs px-4 border border-neutral-200 rounded-nano">
                <Paragraph>{role.name}</Paragraph>
                <input
                  type="checkbox"
                  name="payment"
                  value="credito"
                  checked={selectedRoles.includes(role._id)}
                  disabled={!isEditing}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRoles([...selectedRoles, role._id]);
                    } else {
                      setSelectedRoles(selectedRoles.filter((r) => r !== role._id));
                    }
                  }}
                />
              </label>
            ))
          )}
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-1 ">
            <Button variant="outline" wide onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button wide onClick={handleSave}>
              Salvar
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Editar</Button>
        )}
      </div>
    </div>
  );
}
