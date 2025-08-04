import { Row } from "@/components/row";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { cn } from "@/lib/utils";
import { IGetClient } from "@/types/client";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { useClients } from "@/hooks/useClients";

interface ClientAutoComplete {
  handleSetFilter: (value: string) => void;
  selectedValue: string;
  className?: string;
}

export const ClientAutoComplete = ({
  handleSetFilter,
  selectedValue,
  className,
}: ClientAutoComplete) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounce(value, 500);

  const [page, setPage] = useState(1);
  const [allClients, setAllClients] = useState<IGetClient[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { clients, loading, fetchClients } = useClients();

  useEffect(() => {
    fetchClients({ page, limit: 10, client: debouncedValue });
  }, [page, debouncedValue]);

  useEffect(() => {
    if (!clients?.data) return;
    if (page === 1) {
      setAllClients(clients.data);
    } else {
      setAllClients((prev) => {
        const ids = new Set(prev.map((c) => c._id));
        const novos = clients.data.filter((c: IGetClient) => !ids.has(c._id));
        return [...prev, ...novos];
      });
    }
    setHasMore((clients.data.length ?? 0) >= 10);
  }, [clients?.data, page]);

  useEffect(() => {
    setPage(1);
    setAllClients([]);
  }, [debouncedValue]);

  const listRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || loading || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setPage((p) => p + 1);
    }
  };

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
            ? allClients?.find((client) => client?._id === selectedValue)?.name
            : "Selecionar Cliente"}
          <Row className="gap-2">
            {selectedValue && (
              <X
                onClick={(e) => {
                  e.preventDefault();
                  handleSetFilter("");
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
            placeholder="Procurar Cliente..."
          />
          <CommandList
            className="p-1"
            ref={listRef}
            onScroll={handleScroll}
            style={{ maxHeight: 300, overflowY: "auto" }}
          >
            {loading && (
              <Row className=" h-10 pr-3 w-full">
                <SpinningLogo height={25} width={25} />
              </Row>
            )}
            {!loading && allClients.length === 0 && (
              <CommandEmpty>Nenhum Cliente encontrado.</CommandEmpty>
            )}
            <CommandGroup>
              {allClients?.map((client, index) => (
                <CommandItem
                  key={index}
                  keywords={[client.name]}
                  value={client._id}
                  className="text-sm"
                  onSelect={(currentValue) => {
                    handleSetFilter(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === client._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {client.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {hasMore && (
              <Row className=" h-10 pr-3 w-full justify-center">
                <SpinningLogo height={20} width={20} />
              </Row>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
