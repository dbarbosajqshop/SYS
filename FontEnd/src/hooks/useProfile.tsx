import { useEffect } from "react";
import { getUser } from "@/services/users";
import { useContext } from "react";
import { ProfileContext } from "@/context/ProfileProvider";
import { IGetRole } from "@/types/roles";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  const {
    profile,
    setProfile,
    showMobileMenu,
    setShowMobileMenu,
    permissions,
    setPermissions,
  } = useContext(ProfileContext);

  const userId = localStorage.getItem("userId");
  const setProfiles = async () => {
    try {
      if (!userData?.data) return;

      setProfile(userData?.data);
      setPermissions(
        userData?.data?.Roles?.map((role: IGetRole) =>
          role?.permissions?.map((permission) => permission?.name)
        )?.flat()
      );
    } catch (error) {
      console.error(error);
    }
  };

  const hasAdminRole = profile?.Roles?.some((role) => role.name === "admin");

  const authorize = (perm: string) => {
    return !!permissions?.length && permissions?.includes(perm);
  };

  const { data: userData, refetch } = useQuery({
    queryKey: ["getProfile", userId],
    queryFn: () => getUser(userId as string),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    setProfiles();
  }, [userData]);

  return {
    profile,
    hasAdminRole,
    showMobileMenu,
    setShowMobileMenu,
    refetchProfile: refetch,
    permissions,
    authorize,
  };
};
