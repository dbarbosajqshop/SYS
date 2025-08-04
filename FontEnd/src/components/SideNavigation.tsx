import { ArrowLeft } from "@/icons/ArrowLeft";
import { Dashboard } from "@/icons/Dashboard";
import { useState, useEffect } from "react";
import { SideNavigationItem } from "@/components/SideNavigationItem";
import { Ar } from "@/icons/Ar";
import { Inventory } from "@/icons/Inventory";
import { ShoppingCart } from "@/icons/ShoppingCart";
import { Logout } from "@/icons/Logout";
import { ArrowRight } from "@/icons/ArrowRight";
import { useLocation, useNavigate } from "react-router-dom";
import { SideMenuMobile } from "./SideMenuMobile";
import { useProfile } from "@/hooks/useProfile";
import { FileText, History } from "lucide-react";

const logo = import.meta.env.VITE_LOGO_URL;

export const SideNavigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { profile, authorize } = useProfile();
  const userRoles = profile?.Roles?.map((role) => role.name) || [];

  const path = location.pathname.split("/")[1];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className={`sm:flex hidden flex-col gap-10 py-sm border-r border-neutral-200 h-screen ${
          isCollapsed ? "w-[80px] px-xs" : "w-[296px] px-md"
        } transition-all duration-300`}
      >
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <>
              <img src={logo} alt="logo" />
              <ArrowLeft onClick={() => setIsCollapsed(true)} />
            </>
          ) : (
            <ArrowRight className="mx-auto" onClick={() => setIsCollapsed(false)} />
          )}
        </div>
        <div>
          {!(userRoles?.includes("seller_local") && userRoles.length === 1) && (
            <>
              {authorize("sidebar_dashboard") && (
                <SideNavigationItem
                  icon={<Dashboard color={path === "dashboard" ? "white" : undefined} />}
                  label="Dashboard"
                  isCollapsed={isCollapsed}
                  active={path === "dashboard"}
                  url="/dashboard"
                />
              )}{" "}
              {authorize("sidebar_report") && (
                <SideNavigationItem
                  icon={<FileText color={path === "report" ? "white" : "#A3A3A3"} />}
                  label="Relatório"
                  isCollapsed={isCollapsed}
                  active={path === "report"}
                  url="/report"
                />
              )}
              {authorize("sidebar_register") && (
                <SideNavigationItem
                  icon={<Ar color={path === "register" ? "white" : undefined} />}
                  label="Cadastro"
                  active={path === "register"}
                  isCollapsed={isCollapsed}
                  url="/register"
                />
              )}
              {authorize("sidebar_stock") && (
                <SideNavigationItem
                  icon={<Inventory color={path === "stock" ? "white" : undefined} />}
                  label="Estoque"
                  isCollapsed={isCollapsed}
                  active={path === "stock"}
                  url="/stock"
                />
              )}
              {authorize("r_traceability") && (
                <SideNavigationItem
                  icon={<History color={path === "traceability" ? "white" : "#A3A3A3"} />}
                  label="Registros"
                  isCollapsed={isCollapsed}
                  active={path === "traceability"}
                  url="/traceability"
                />
              )}
            </>
          )}
          {authorize("sidebar_pdv") && (
            <SideNavigationItem
              icon={<ShoppingCart color={path === "sales" ? "white" : undefined} />}
              label="Ponto de venda"
              isCollapsed={isCollapsed}
              active={path === "sales"}
              url="/sales"
            />
          )}
        </div>
        <div onClick={() => localStorage.removeItem("token")} className="fixed bottom-6">
          <SideNavigationItem
            icon={<Logout />}
            url="/login"
            label="Sair"
            isCollapsed={isCollapsed}
            onClick={handleLogout}
          />
        </div>
      </div>
      <SideMenuMobile />
    </>
  );
};
