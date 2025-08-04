import React, { createContext, useState } from "react";
import { IGetUser } from "@/types/user";

export const ProfileContext = createContext<{
  profile: IGetUser;
  setProfile: React.Dispatch<React.SetStateAction<IGetUser>>;
  permissions: string[];
  setPermissions: (permissions: string[]) => void;
  showMobileMenu: boolean;
  setShowMobileMenu: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  profile: {} as IGetUser,
  permissions: [],
  setPermissions: () => {},
  setProfile: () => {},
  showMobileMenu: false,
  setShowMobileMenu: () => {},
});

type ProfileProviderProps = {
  children: React.ReactNode;
};

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const [profile, setProfile] = useState({} as IGetUser);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        showMobileMenu,
        setShowMobileMenu,
        permissions,
        setPermissions,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
