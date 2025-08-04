import { Search } from "@/icons/Search";
import { Input } from "@/ui/Input";
import { CartItemCard } from "./CartItemCard";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { Button } from "@/ui/Button";
import { ICartItem, IGetCatalogy } from "@/types/catalogy";
import { Subtitle } from "@/ui/typography/Subtitle";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  searchResults: IGetCatalogy[];
  addItemToCart: (item: ICartItem, type: "box" | "unit") => void;
  loadingCatalogy: boolean;
  hasMore: boolean;
  setCurrentPage: (value: React.SetStateAction<number>) => void;
  orderLocal: "online" | "presencial" | "";
  setOpenOrderLocalModal: (value: boolean) => void;
  canChooseOrderLocal: boolean;
};

export const StockPanel = ({
  search,
  setSearch,
  searchResults,
  addItemToCart,
  loadingCatalogy,
  hasMore,
  setCurrentPage,
  orderLocal,
  setOpenOrderLocalModal,
  canChooseOrderLocal,
}: Props) => {
  return (
    <div className="sm:order-1 -order-1 flex flex-col gap-6 p-sm border bg-neutral-0">
      {orderLocal !== "" && canChooseOrderLocal ? (
        <Button onClick={() => setOpenOrderLocalModal(true)}>Estoque {orderLocal}</Button>
      ) : (
        <Subtitle variant="large" className="text-center">
          Itens em estoque
        </Subtitle>
      )}

      <Input
        wide
        className="bg-neutral-0  -my-5"
        icon={<Search />}
        iconPosition="left"
        placeholder="Procure por código ou nome do produto"
        data={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="scroll-container max-h-[60vh] overflow-y-auto flex sm:flex-wrap overflow-x-auto gap-4 p-nano">
        {searchResults?.map((item, index) => (
          <CartItemCard
            key={item.sku + index}
            item={item}
            onAddBox={() => addItemToCart(item as ICartItem, "box")}
            onAddUnit={() => addItemToCart(item as ICartItem, "unit")}
          />
        ))}
        {loadingCatalogy && (
          <div className="w-full flex py-4">
            <SpinningLogo />
          </div>
        )}
        {!loadingCatalogy && searchResults?.length === 0 && (
          <div className="w-full flex justify-center py-4">
            <span>Nenhum item encontrado.</span>
          </div>
        )}
        {!loadingCatalogy && hasMore && searchResults.length > 0 && (
          <div className="w-full flex justify-center py-4">
            <Button onClick={() => setCurrentPage((prev) => prev + 1)}>Ver mais</Button>
          </div>
        )}
      </div>
    </div>
  );
};
