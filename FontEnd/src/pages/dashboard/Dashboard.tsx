import { OverviewCard } from "@/components/OverviewCard";
import { Monetization } from "@/icons/Monetization";
import { Heading } from "@/ui/typography/Heading";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useQuery } from "@tanstack/react-query";
import { getOrdersDashboard } from "@/services/dashboard";
import { formatCurrencyText } from "@/helpers";
import { Package, Clock } from "lucide-react";
import { redirectWarning } from "@/helpers/messagesWarnings";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authorize, permissions } = useProfile();

  useEffect(() => {
    if (!authorize("sidebar_dashboard") && permissions.length) {
      navigate("/profile");
      redirectWarning();
    }

    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
      if (authorize("r_separation_orders")) return navigate("/dashboard/separation");
      if (authorize("r_pending_orders")) return navigate("/dashboard/pending");
      if (authorize("r_conference_orders")) return navigate("/dashboard/review");
      if (authorize("r_docks_orders")) return navigate("/dashboard/docks");
      if (authorize("r_delivered_orders")) return navigate("/dashboard/delivered");
      if (authorize("r_payments_order")) return navigate("/dashboard/in-payment");
    }
  }, [location.pathname, authorize, navigate, permissions]);

  const { data: ordersDashboard } = useQuery({
    queryKey: ["ordersDashboard"],
    queryFn: () => getOrdersDashboard(),
  });

  const isSeller = authorize("w_seller_online") || authorize("w_seller_local");

  return (
    <div className="flex flex-col gap-6 py-sm px-sm sm:px-md bg-neutral-100 h-full">
      <div>
        <Heading variant="medium">Dashboard</Heading>
        <Subtitle variant="small" color="text-neutral-500">
          Acompanhe suas métricas
        </Subtitle>
      </div>
      <div className="flex flex-wrap lg:flex-nowrap gap-6">
        <OverviewCard
          icon={<Package className="size-7" />}
          title="Total de vendas"
          value={ordersDashboard?.totalVendasMesCount || 0}
        />
        <OverviewCard
          icon={<Monetization />}
          title="Valor Total de Vendas"
          value={formatCurrencyText(
            String(ordersDashboard?.totalVendasMesValue?.toFixed(2))
          )}
        />
        {isSeller && (
          <OverviewCard
            icon={<Clock className="size-7" />}
            title="Vendas Pendentes"
            value={ordersDashboard?.pendingOrdersCount || 0}
          />
        )}
      </div>
      <Outlet />
    </div>
  );
}
