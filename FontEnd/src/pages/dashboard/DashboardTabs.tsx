import { useProfile } from "@/hooks/useProfile";
import { TabItem } from "@/ui/TabItem";
import { useLocation } from "react-router-dom";

export const DashboardTabs = () => {
  const { pathname } = useLocation();

  const { authorize } = useProfile();

  const orderStatus = () => {
    const status = [];
    // if (authorize("r_all_orders")) {
    //   status.push({ title: "Todas", path: "all" });
    // }
    if (authorize("r_payments_order"))
      status.push({ title: "Em pagamento", path: "in-payment" });

    if (authorize("r_pending_orders"))
      status.push({ title: "Pendentes", path: "pending" });

    if (authorize("r_separation_orders"))
      status.push({ title: "Separação", path: "separation" });

    if (authorize("r_conference_orders"))
      status.push({ title: "Conferência", path: "review" });

    if (authorize("r_docas_orders")) status.push({ title: "Em docas", path: "docks" });

    if (authorize("r_delivered_orders"))
      status.push({ title: "Entregue", path: "delivered" });

    return status;
  };

  const screen = pathname.split("/").reverse()[0];
  const isActive = (path: string) => screen === path;

  return (
    <div className="flex">
      {orderStatus().map((tab, index) => (
        <TabItem
          key={index}
          url={`/dashboard/${tab.path}`}
          active={isActive(tab.path)}
          title={tab.title}
        />
      ))}
    </div>
  );
};
