import { ConfigProvider } from "antd/lib";
import { Column } from "./components/column";
import { Row } from "./components/row";
import { ClientAutoComplete } from "./pages/report/components/clientAutoComplete";
import { SellerAutoComplete } from "./pages/report/components/sellerAutoComplete";
import { Select } from "./ui/Select";
import { Paragraph } from "./ui/typography/Paragraph";
import { Subtitle } from "./ui/typography/Subtitle";
import { DatePicker } from "antd";
import locale from "antd/locale/pt_BR";
import { TFilters } from "./pages/report/useReportOrders";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { cn } from "./lib/utils";
import { FilterIcon } from "lucide-react";
import { Select as AntdSelect } from "antd";
const { RangePicker } = DatePicker;

interface ReportFiltersProps {
  filters: TFilters;
  setFilters: React.Dispatch<React.SetStateAction<TFilters>>;
  handleSetFilter: (key: string, value: string) => void;
  onChangePayments: (value: string) => void;
  payments: string[];
}

export const ReportFilters = ({
  filters,
  setFilters,
  handleSetFilter,
  onChangePayments,
  payments,
}: ReportFiltersProps) => {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "flex gap-2 ml-auto transition-all border-neutral-300 bg-white border rounded-md p-4 px-8 items-center",
          (Object.values(filters)?.filter((e) => !!e?.length)?.length ||
            payments?.length) &&
            "bg-brand-600 text-white font-bold "
        )}
      >
        <FilterIcon fill="white" /> Filtrar
      </PopoverTrigger>
      <PopoverContent
        className="w-[500px] pb-10 flex flex-col gap-6"
        align="end"
        side="bottom"
      >
        <Column>
          <Subtitle variant="large-semibold">Filtros</Subtitle>
          <Subtitle variant="large">customize sua busca </Subtitle>
        </Column>
        <Row className="sm:gap-5 grid grid-cols-2">
          <Column className="justify-center gap-2">
            <Paragraph variant="large-semibold">Vendedor</Paragraph>

            <SellerAutoComplete
              selectedValue={filters?.SellerId}
              handleSetFilter={(str) => handleSetFilter("SellerId", str)}
            />
          </Column>{" "}
          <Column className="justify-center gap-2">
            <Paragraph variant="large-semibold">Cliente</Paragraph>

            <ClientAutoComplete
              selectedValue={filters?.ClientId}
              handleSetFilter={(str) => handleSetFilter("ClientId", str)}
            />
          </Column>
          <Column className="justify-center gap-2">
            <Paragraph variant="large-semibold">Local </Paragraph>

            <Select
              clearable
              className="-my-4 w-full pl-2 pr-6 text-sm"
              onChange={(e) => handleSetFilter("local", e.target.value)}
              data={filters?.local}
              options={[
                { label: "Presencial", value: "presencial" },
                { label: "Online", value: "online" },
              ]}
            />
          </Column>{" "}
          <Column className="justify-center gap-2">
            <Paragraph variant="large-semibold">Status </Paragraph>

            <Select
              clearable
              className="-my-4 pl-2 w-full pr-6 text-sm"
              onChange={(e) => handleSetFilter("status", e.target.value)}
              data={filters?.status}
              options={[
                { label: "Entregue", value: "entregue" },
                { label: "Separação", value: "separacao" },
                { label: "Conferência", value: "conferencia" },
                { label: "Pendente", value: "pendente" },
              ]}
            />
          </Column>
          <ConfigProvider locale={locale}>
            <Column className="justify-center gap-2">
              <Paragraph variant="large-semibold">Data</Paragraph>
              <RangePicker
                onChange={(_dates, datesStr) => {
                  setFilters((prev) => ({
                    ...prev,
                    dateOfOrderStart: datesStr[0],
                    dateOfOrderEnd: datesStr[1],
                  }));
                }}
                className="h-12"
              />
            </Column>
          </ConfigProvider>
          <Column className="justify-center col-span-full gap-2">
            <Paragraph variant="large-semibold">Pagamentos</Paragraph>

            <AntdSelect
              value={payments}
              size="large"
              placeholder="Selecione Os Tipos"
              className=" w-full pr-6 text-sm "
              onSelect={onChangePayments}
              onDeselect={onChangePayments}
              mode="multiple"
              options={[
                { label: "Credito", value: "credito" },
                { label: "Debito", value: "debito" },
                { label: "Pix QrCode", value: "keypix" },
                { label: "Pix Maquina", value: "machinepix" },
                { label: "TED", value: "ted" },
                { label: "Dinheiro", value: "dinheiro" },
              ]}
            />
          </Column>
        </Row>
      </PopoverContent>
    </Popover>
  );
};
