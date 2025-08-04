import { Row } from "@/components/row";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { cn } from "@/lib/utils";
import { getCategories } from "@/services/categories";
import { IGetCategory } from "@/types/categories";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { UIEvent, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface ItemCategoryAutoComplete {
  onChange: (value: string) => void;
  selectedValue: string;
  className?: string;
}

export const ItemCategoryAutoComplete = ({
  onChange,
  selectedValue,
  className,
}: ItemCategoryAutoComplete) => {
  const [ItemCategorys, setItemCategorys] = useState<IGetCategory[]>([]);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["ItemCategorys", debouncedValue],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => getCategories(pageParam, 10, value),
      getNextPageParam: (lastPage, _pages, lastPageParam) => {
        return lastPage?.data?.totalPages > lastPageParam
          ? lastPageParam + 1
          : undefined;
      },
    });

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const obj = event.currentTarget;
    console.log(hasNextPage);
    if (
      obj.scrollTop === obj.scrollHeight - obj.offsetHeight &&
      hasNextPage &&
      !isFetchingNextPage &&
      open
    ) {
      obj.scrollTop = obj.scrollTop - 1;
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (data?.pages?.length) {
      const newItemCategorys = data?.pages
        ?.map((page) => page?.data?.data)
        ?.flat();
      setItemCategorys(newItemCategorys);
    }
  }, [data]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center text-sm text-neutral-600 rounded-md  gap-2 border h-12 px-4 w-full p-2 justify-between",
            className
          )}
        >
          {selectedValue
            ? ItemCategorys?.find(
                (ItemCategory) => ItemCategory?._id === selectedValue
              )?.name
            : "Selecionar ItemCategorye"}
          <Row className="gap-2">
            {selectedValue && (
              <X
                onClick={(e) => {
                  e.preventDefault();
                  onChange("");
                  setOpen(false);
                }}
              />
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Row>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput
            onValueChange={setValue}
            className=""
            placeholder="Procurar Categoria..."
          />
          <CommandList onScroll={onScroll} className="p-1">
            <CommandEmpty>Nenhum Vendedor encontrado.</CommandEmpty>
            <CommandGroup>
              {ItemCategorys?.map((ItemCategory, index) => (
                <CommandItem
                  key={index}
                  keywords={[ItemCategory.name]}
                  value={ItemCategory._id}
                  className="text-sm"
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === ItemCategory._id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {ItemCategory.name}
                </CommandItem>
              ))}
              {(isFetchingNextPage || isFetching) && (
                <Row className=" h-10 pr-3 w-full">
                  <SpinningLogo height={25} width={25} />
                </Row>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
