import { Outlet } from "react-router-dom";
import { SideNavigation } from "./SideNavigation";
import { Header } from "./Header";

export const SideMenu = () => {
  return (
    <div className="flex">
      <SideNavigation />
      <div className="w-full bg-neutral-100 pb-sm h-full max-h-screen overflow-y-auto">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};
