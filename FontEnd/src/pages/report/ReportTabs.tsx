import { useProfile } from "@/hooks/useProfile";
import { TabItem } from "@/ui/TabItem";
import { useLocation } from "react-router-dom";

export const ReportTabs = () => {
  const { pathname } = useLocation();
  const { authorize } = useProfile();

  const screens = () => {
    const newScreen = [];

    if (authorize("r_report_orders")) newScreen.push({ title: "Vendas", path: "orders" });
    if (authorize("r_report_items")) newScreen.push({ title: "Itens", path: "items" });
    if (authorize("r_report_orders")) newScreen.push({ title: "NCM", path: "ncm" });
    if (authorize("r_report_orders"))
      newScreen.push({ title: "Itens Vendidos", path: "sold" });
    if (authorize("r_report_orders")) newScreen.push({ title: "Custo", path: "cost" });

    return newScreen;
  };

  const screen = pathname.split("/").reverse()[0];
  const isActive = (path: string) => screen === path;

  return (
    <div className="flex">
      {screens()?.map((tab, index) => (
        <TabItem
          key={index}
          url={`/report/${tab.path}`}
          active={isActive(tab.path)}
          title={tab.title}
        />
      ))}
    </div>
  );
};
