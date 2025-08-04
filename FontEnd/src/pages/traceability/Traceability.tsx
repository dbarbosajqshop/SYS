import { Heading } from "@/ui/typography/Heading";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { redirectWarning } from "@/helpers/messagesWarnings";

export default function Traceability() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { authorize, permissions } = useProfile(); 

  useEffect(() => {
    if (!authorize("r_traceability") && permissions.length > 0) { 
      navigate("/profile"); 
      redirectWarning();
      return;
    }
    if (pathname === "/traceability") {
      navigate("/traceability/users");
    }
  }, [pathname, authorize, permissions, navigate]);

  return (
    <div className="flex flex-col gap-6 py-sm px-sm sm:px-md bg-neutral-100 h-full">
      <div>
        <Heading variant="medium">Registros</Heading>
        <Subtitle variant="small" color="text-neutral-500">
          Acompanhe os registros de auditoria do sistema
        </Subtitle>
      </div>
      <Outlet />
    </div>
  );
}