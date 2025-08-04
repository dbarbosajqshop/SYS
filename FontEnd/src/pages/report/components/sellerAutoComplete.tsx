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
import { getSellers } from "@/services/users"; 
import { useInfiniteQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { UIEvent, useEffect, useState } from "react";

interface SellerAutoComplete {
  handleSetFilter: (value: string) => void;
  selectedValue: string;
}

export const SellerAutoComplete = ({
  handleSetFilter,
  selectedValue,
}: SellerAutoComplete) => {
  const [users, setUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(""); 

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["sellers"],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => getSellers(pageParam, 10), 
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
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (data?.pages?.length) {
      const newUsers = data.pages.map((page) => page?.data).flat();
      setUsers(newUsers);
    }
  }, [data]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center text-sm text-neutral-600 rounded-md gap-2 border h-12 px-4 w-full p-2 justify-between">
          {selectedValue
            ? users?.find((user) => user?._id === selectedValue)?.name
            : "Selecionar Vendedor"}
          <Row className="gap-2">
            {selectedValue && (
              <X
                onClick={(e) => {
                  e.preventDefault();
                  handleSetFilter("");
                  setValue(""); 
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
            placeholder="Procurar Vendedor..."
          />
          <CommandList onScroll={onScroll} className="p-1">
            {isFetching && !isFetchingNextPage && <Row className=" h-10 pr-3 w-full justify-center items-center"><SpinningLogo height={25} width={25} /></Row>}
            <CommandEmpty>Nenhum Vendedor encontrado.</CommandEmpty>
            <CommandGroup>
              {filteredUsers?.map((user) => ( 
                <CommandItem
                  key={user._id} 
                  keywords={[user.name]}
                  value={user._id}
                  className="text-sm"
                  onSelect={(currentValue) => {
                    handleSetFilter(currentValue === selectedValue ? "" : currentValue);
                    setValue(
                      filteredUsers.find((user) => user._id === currentValue)?.name || ""
                    );
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === user._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {user.name}
                </CommandItem>
              ))}
              {isFetchingNextPage && ( 
                <Row className=" h-10 pr-3 w-full justify-center items-center">
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