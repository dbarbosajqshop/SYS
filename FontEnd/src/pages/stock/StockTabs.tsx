import { useProfile } from "@/hooks/useProfile";
import { TabItem } from "@/ui/TabItem";
import { useLocation } from "react-router-dom";

export const StockTabs = () => {
  const { pathname } = useLocation();

  const { authorize } = useProfile();

  const screens = () => {
    const newScreen = [];

    if (authorize("r_purchase")) newScreen.push({ title: "Compras", path: "purchases" });
    if (authorize("r_stocked_item")) newScreen.push({ title: "Itens", path: "items" });
    if (authorize("r_stocked_item"))
      newScreen.push({ title: "Itens Reservados", path: "reserved-items" });

    return newScreen;
  };

  const screen = pathname.split("/").reverse()[0];
  const isActive = (path: string) => screen === path;

  return (
    <div className="flex">
      {screens()?.map((tab, index) => (
        <TabItem
          key={index}
          url={`/stock/${tab.path}`}
          active={isActive(tab.path)}
          title={tab.title}
        />
      ))}
    </div>
  );
};
