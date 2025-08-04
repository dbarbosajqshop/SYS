import { useProfile } from "@/hooks/useProfile";
import { TabItem } from "@/ui/TabItem";
import { useLocation } from "react-router-dom";

export const RegisterTabs = () => {
  const { pathname } = useLocation();
  const { authorize } = useProfile();

  const screens = () => {
    const newScreen = [];
    if (authorize("r_register_items"))
      newScreen.push({ title: "Itens", path: "items" });
    if (authorize("r_register_stocks"))
      newScreen.push({ title: "Estoque", path: "stocks" });
    if (authorize("r_register_users"))
      newScreen.push({ title: "Usuários", path: "users" });
    if (authorize("r_register_clients"))
      newScreen.push({ title: "Clientes", path: "clients" });
    if (authorize("r_register_docks"))
      newScreen.push({ title: "Docas", path: "docks" });
    if (authorize("r_register_categories"))
      newScreen.push({ title: "Categorias", path: "categories" });
    if (authorize("r_register_taxes"))
      newScreen.push({ title: "Taxas", path: "taxes" });

    return newScreen;
  };

  const screen = pathname.split("/").reverse()[0];
  const isActive = (path: string) => screen === path;

  return (
    <div className="flex">
      {screens()?.map((tab, index) => (
        <TabItem
          key={index}
          url={`/register/${tab.path}`}
          active={isActive(tab.path)}
          title={tab.title}
        />
      ))}
    </div>
  );
};