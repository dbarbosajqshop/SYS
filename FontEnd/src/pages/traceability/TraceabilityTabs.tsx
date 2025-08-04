import { useProfile } from "@/hooks/useProfile";
import { TabItem } from "@/ui/TabItem";
import { useLocation, useNavigate } from "react-router-dom";

export const TraceabilityTabs = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { authorize } = useProfile();

  const screens = () => {
    const newScreen = [];
    if (authorize("r_traceability")) {
      newScreen.push({ title: "Usuário", path: "users" });
      newScreen.push({ title: "Itens", path: "items" });
      // newScreen.push({ title: "Movimentação", path: "item-movements" });
      newScreen.push({ title: "Itens Estocados", path: "stocked-items" }); 
      newScreen.push({ title: "Categorias", path: "categories" });
      newScreen.push({ title: "Clientes", path: "clients" });
      newScreen.push({ title: "Docas", path: "docks" });
      newScreen.push({ title: "Pedidos", path: "orders" });
      newScreen.push({ title: "Estoques", path: "stocks" });
      newScreen.push({ title: "Taxas", path: "taxes" });
    }
    return newScreen;
  };

  const screen = pathname.split("/").reverse()[0];
  const isActive = (path: string) => screen === path;

  return (
    <div className="flex">
      {screens()?.map((tab, index) => (
        <TabItem
          key={index}
          url={`/traceability/${tab.path}`}
          active={isActive(tab.path)}
          title={tab.title}
          onClick={() => {
            if (!isActive(tab.path)) {
              navigate(`/traceability/${tab.path}`);
            }
          }}
        />
      ))}
    </div>
  );
};
