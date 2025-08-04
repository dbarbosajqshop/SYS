import { OverviewCard } from "@/components/OverviewCard";
import { redirectWarning } from "@/helpers/messagesWarnings";
import { useItems } from "@/hooks/useItems"; 
import { useStocks } from "@/hooks/useStocks"; 
import { useProfile } from "@/hooks/useProfile";
import { Apartment } from "@/icons/Apartment";
import { Inventory } from "@/icons/Inventory";
import { Layers } from "@/icons/Layers";
import { PinDrop } from "@/icons/PinDrop";
import { Heading } from "@/ui/typography/Heading";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Register() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { authorize, permissions } = useProfile();
  const { items } = useItems();
  const { stocks } = useStocks();
  const canReadItems = authorize("r_items");
  const canReadStocks = authorize("r_register_stocks");

  useEffect(() => {
    if (!authorize("sidebar_register") && permissions.length) {
      navigate("/profile");
      redirectWarning();
      return;
    }
    if (pathname === "/register") {
      if (authorize("r_register_items")) return navigate("/register/items");
      if (authorize("r_register_stocks")) return navigate("/register/stocks");
      if (authorize("r_register_users")) return navigate("/register/users");
      if (authorize("r_register_clients")) return navigate("/register/clients");
      if (authorize("r_register_categories")) navigate("/register/categories");
      if (authorize("r_register_docks")) return navigate("/register/docks");
      if (authorize("r_register_taxes")) return navigate("/register/taxes");
    }
  }, [pathname, authorize, navigate, permissions.length]);

  const isStockId = pathname.split("/").length > 3;

  return (
    <div className="flex flex-col gap-6 py-sm px-sm sm:px-md bg-neutral-100 h-full">
      {!isStockId && (
        <>
          <div>
            <Heading variant="medium">Cadastro</Heading>
            <Subtitle variant="small" color="text-neutral-500">
              Acompanhe seus cadastros
            </Subtitle>
          </div>
          <div className="flex flex-wrap lg:flex-nowrap gap-6">
            {canReadItems && (
              <OverviewCard
                icon={<Inventory />}
                title="Itens cadastrados"
                value={items?.totalItems || "-"}
              />
            )}
            {canReadStocks && (
              <>
                <OverviewCard
                  icon={<PinDrop />}
                  title="Total de ruas"
                  value={stocks?.totals.totalStreets || "-"}
                />
                <OverviewCard
                  icon={<Apartment />}
                  title="Total de prédios"
                  value={stocks?.totals.totalBuilds || "-"}
                />
                <OverviewCard
                  icon={<Layers />}
                  title="Total de andar"
                  value={stocks?.totals.totalFloors || "-"}
                />
              </>
            )}
          </div>
        </>
      )}
      <Outlet />
    </div>
  );
};