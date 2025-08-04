import { getRoles } from "@/services/roles";
import { IGetRole } from "@/types/roles";
import { IPutUser } from "@/types/user";
import { Input } from "@/ui/Input";
import { Select } from "@/ui/Select";
import { useEffect, useState } from "react";

type UserProps = {
  userData: IPutUser;
  setUserData: (
    userData:
      | UserProps["userData"]
      | ((prevData: UserProps["userData"]) => UserProps["userData"])
  ) => void;
};

export const UserEdit = ({ userData, setUserData }: UserProps) => {
  const [roles, setRoles] = useState<IGetRole[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await getRoles();
      setRoles(response.data);
    };
    fetchRoles();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prevData: UserProps["userData"]) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <Input
        wide
        name="name"
        data={userData?.name}
        label="Nome completo"
        onChange={handleInputChange}
      />
      <Input
        wide
        name="email"
        data={userData?.email}
        label="E-mail"
        onChange={handleInputChange}
        disabled
      />
      <Input
        wide
        name="password"
        data={"******"}
        label="Senha"
        onChange={() => {}}
        disabled
      />
      <Select
        wide
        name="role"
        data={userData?.role}
        onChange={handleInputChange}
        label="Permissão"
        options={
          roles.length > 0
            ? roles?.map((role) => ({
                label: role.name.replace("_", " "),
                value: role.name,
              }))
            : []
        }
      />
    </div>
  );
};
