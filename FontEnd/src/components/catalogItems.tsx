import { UIEvent, useEffect, useState } from "react";
import { Column } from "./column";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCatalogy } from "@/services/catalogy";
import { Row } from "./row";
import { Flex, Input } from "antd";
import { Search } from "@/icons/Search";
import { IGetCatalogy } from "@/types/catalogy";
import { CartItemCard } from "./CartItemCard";
import { useDebounce } from "use-debounce";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { IconButton } from "@/ui/IconButton";

interface CatalogItemsProps {
  addItem: (item: IGetCatalogy, type: 'unit' | 'box') => void;
  editing: boolean;
}

export const CatalogItems = ({ addItem, editing }: CatalogItemsProps) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<IGetCatalogy[]>([]);
  const [search, setSearch] = useState("");

  const deboucedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (!editing) {
      setOpen(false);
    }
    setOpen(true);
  }, [editing]);

  const {
    data: catalogs,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["infinityCatalogItems", deboucedSearch],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getCatalogy(pageParam, 10, search),
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      return lastPage?.totalPages > lastPageParam
        ? lastPageParam + 1
        : undefined;
    },
  });

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const obj = event.currentTarget;
    if (
      obj.scrollTop === obj.scrollHeight - obj.offsetHeight &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      obj.scrollTop = obj.scrollTop - 1;
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (catalogs?.pages?.length) {
      const newItems = catalogs?.pages?.map((page) => page?.data)?.flat();
      setItems(newItems);
    }
  }, [catalogs]);

  return (
    <Column
      className={cn(
        "bg-white border pt-3 transition-all h-full",
        editing
          ? open
            ? "w-3/4 translate-x-0"
            : "w-72 translate-x-0"
          : " w-0 translate-x-[500px]"
      )}
    >
      <Row className="border-b pb-3 px-3 text-neutral-500 ">
        <IconButton
          variant="standard"
          size="small"
          onClick={() => setOpen(!open)}
        >
          <ChevronLeft
            className={cn(
              "cursor-pointer  transition-all ",
              open ? "rotate-180" : ""
            )}
          />
        </IconButton>
        <Subtitle variant="small-semibold" color="text-neutral-600">
          Itens
        </Subtitle>
      </Row>
      <Column className="p-2 px-3">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar..."
          className="pr-1"
          suffix={<Search />}
        />
      </Column>

      <Column
        onScroll={onScroll}
        className={cn(
          "py-2   overflow-y-auto transition-all h-[65vh]",
          open ? "p-2.5" : "p-1.5"
        )}
      >
        <Flex
          gap={"small"}
          wrap
          className=" justify-center pb-5  transition-all "
        >
          {catalogs &&
            items?.map((item, index) => (
              <CartItemCard
                small={!open}
                key={index}
                item={item}
                onAddUnit={() => addItem(item, 'unit')}
                onAddBox={() => addItem(item, 'box')}
              />
            ))}
        </Flex>
        {isFetching && (
          <Row className="pr-14 py-2">
            <SpinningLogo />
          </Row>
        )}
      </Column>
    </Column>
  );
};
