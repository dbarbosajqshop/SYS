import { useLocation } from "react-router-dom";
import { SideNavigationItem } from "./SideNavigationItem";
import { Ar } from "@/icons/Ar";
import { Dashboard } from "@/icons/Dashboard";
import { Inventory } from "@/icons/Inventory";
import { ShoppingCart } from "@/icons/ShoppingCart";
import { Logout } from "@/icons/Logout";
import { useProfile } from "@/hooks/useProfile";
import { FileText } from "lucide-react";

export const SideMenuMobile = () => {
  const { showMobileMenu, setShowMobileMenu, profile } = useProfile();
  const location = useLocation();

  const userRoles = profile?.Roles?.map((role) => role.name) || [];

  const path = location.pathname.split("/")[1];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowMobileMenu(false);
  };

  return (
    <div
      className={`${
        showMobileMenu ? "absolute w-64" : "-z-10 w-0"
      } h-full bg-brand-600 z-10 mt-14 transition-all duration-300`}
    >
      {showMobileMenu && (
        <div
          className={`flex flex-col justify-between ml-2 gap-10 py-sm h-[90%] transition-all duration-300`}
          onClick={() => setShowMobileMenu(false)}
        >
          <div className="flex flex-col gap-2">
            {!(userRoles?.includes("seller_local") && userRoles.length === 1) && (
              <>
                <SideNavigationItem
                  icon={<Dashboard color={path === "dashboard" ? "white" : undefined} />}
                  label="Dashboard"
                  active={path === "dashboard"}
                  url="/dashboard"
                />
                <SideNavigationItem
                  icon={<FileText color={path === "report" ? "white" : "#A3A3A3"} />}
                  label="Relatório"
                  active={path === "report"}
                  url="/report"
                />
                <SideNavigationItem
                  icon={<Ar color={path === "register" ? "white" : undefined} />}
                  label="Cadastro"
                  active={path === "register"}
                  url="/register"
                />
                <SideNavigationItem
                  icon={<Inventory color={path === "stock" ? "white" : undefined} />}
                  label="Estoque"
                  active={path === "stock"}
                  url="/stock"
                />
              </>
            )}

            <SideNavigationItem
              icon={<ShoppingCart color={path === "sales" ? "white" : undefined} />}
              label="Ponto de venda"
              active={path === "sales"}
              url="/sales"
            />
          </div>
          <div onClick={() => handleLogout}>
            <SideNavigationItem icon={<Logout />} url="/login" label="Sair" />
          </div>
        </div>
      )}
    </div>
  );
};
