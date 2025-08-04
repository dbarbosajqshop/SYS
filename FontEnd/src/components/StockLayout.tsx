import { Heading } from "@/ui/typography/Heading";
import { Subtitle } from "@/ui/typography/Subtitle";
import { OverviewCard } from "./OverviewCard";
import { Check, ShoppingBag } from "lucide-react";
import { FaRegClock } from "react-icons/fa6";
import { MdOutlineInventory2 } from "react-icons/md";
import { Outlet } from "react-router-dom";
import { getPurchasesDashboard } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";

export const StockLayout = () => {
  const { data: purchasesDashboard } = useQuery({
    queryKey: ["purchasesDashboard"],
    queryFn: getPurchasesDashboard,
  });

  return (
    <div className="flex flex-col gap-6 py-sm px-sm sm:px-md bg-neutral-100 h-full">
      <div>
        <Heading variant="medium">Estoque</Heading>
        <Subtitle variant="small" color="text-neutral-500">
          Acompanhe seu estoque
        </Subtitle>
      </div>
      <div className="flex flex-wrap lg:flex-nowrap gap-6">
        <OverviewCard
          icon={<ShoppingBag />}
          title="Compras "
          value={purchasesDashboard?.purchases?.toString() || "--"}
        />
        <OverviewCard
          icon={<Check />}
          title="Entregues"
          value={purchasesDashboard?.deliveredPurchases?.toString() || "--"}
        />
        <OverviewCard
          icon={<FaRegClock className="size-6" />}
          title="Pendentes"
          value={purchasesDashboard?.pendingPurchases?.toString() || "--"}
        />{" "}
        <OverviewCard
          icon={<MdOutlineInventory2 className="size-6" />}
          title="Itens estocados "
          value={purchasesDashboard?.stockedItems?.toString() || "--"}
        />
      </div>
      <Outlet />
    </div>
  );
};
