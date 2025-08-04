import { redirectWarning } from "@/helpers/messagesWarnings";
import { useProfile } from "@/hooks/useProfile";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Stock() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authorize, permissions } = useProfile();

  useEffect(() => {
    if (!authorize("sidebar_stock") && permissions.length) {
      navigate("/profile");
      redirectWarning();
    }
    if (location.pathname === "/stock" || location.pathname === "/stock/") {
      if (authorize("r_purchase")) navigate("/stock/purchases");
      else if (authorize("r_stocked_item")) navigate("/stock/items"); 
    }
  }, [location.pathname, authorize, navigate, permissions]);

  return null;
}