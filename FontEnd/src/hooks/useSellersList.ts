import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSellersUnpaginated } from "@/services/users"; 
import { Seller } from "@/types/user";

interface ApiSeller {
  _id?: string; 
  id?: string; 
  name: string;
}

export const useSellersList = (hasAdminRole: boolean) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loadingSellers, setLoadingSellers] = useState(false);

  useEffect(() => {
    const fetchSellersList = async () => {
      if (hasAdminRole) {
        setLoadingSellers(true);
        try {
          const responseData: ApiSeller[] = await getSellersUnpaginated(); 

          if (responseData && Array.isArray(responseData)) { 
            setSellers(
              responseData.map((seller: ApiSeller) => ({ 
                id: seller._id || seller.id, 
                name: seller.name,
              })) as Seller[] 
            );
          } else {
            console.error("Formato de dados inesperado ao buscar vendedores:", responseData);
            toast.error("Formato de dados de vendedores inesperado.");
          }

        } catch (error) {
          toast.error("Erro ao carregar lista de vendedores.", { theme: "colored" });
          console.error("Erro ao buscar vendedores:", error);
        } finally {
          setLoadingSellers(false);
        }
      }
    };
    fetchSellersList();
  }, [hasAdminRole]);

  return { sellers, loadingSellers };
};