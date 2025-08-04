import { ArrowBack } from "@/icons/ArrowBack";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { IconButton } from "@/ui/IconButton";
import { Caption } from "@/ui/typography/Caption";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReportItemPerSeller } from "./useReportItemPerSeller";
import { Table } from "@/ui/Table";
import { Pagination } from "@/ui/Pagination";
import { useItems } from "@/hooks/useItems";
import { IGetItem } from "@/types/items";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

export default function ReportItemPerSeller() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [item, setItem] = useState<IGetItem>({} as IGetItem);

  const navigate = useNavigate();
  const location = useLocation();

  const { sellers, fetchItems, loading } = useReportItemPerSeller();
  const { fetchItem, loading: loadingItem } = useItems();

  const getSellers = async () => {
    await fetchItems({
      itemId: location.pathname.split("/").pop() || "",
      startDate,
      endDate,
    });
  };

  const getItem = async () => {
    const itemId = location.pathname.split("/").pop() || "";
    const itemData = await fetchItem(itemId);
    setItem(itemData);
  };

  useEffect(() => {
    getItem();
  }, [location.pathname]);

  useEffect(() => {
    getSellers();
  }, [location.pathname, startDate, endDate]);

  const handlePageClick = (selected: number) => {
    fetchItems({
      itemId: location.pathname.split("/").pop() || "",
      page: selected,
      startDate,
      endDate,
    });
  };

  if (loadingItem) return <SpinningLogo />;

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      <div className="flex items-center">
        <IconButton
          size="large"
          iconColor="#71717A"
          onClick={() => navigate("/report/sold")}
        >
          <ArrowBack />
        </IconButton>
        <Caption variant="large" color="text-neutral-500">
          Relatório / Itens vendidos
        </Caption>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
        <div className="w-full">
          <Paragraph variant="large" color="text-neutral-500">
            Vendas do item:
          </Paragraph>
          <Subtitle variant="large">{item?.name}</Subtitle>
        </div>
        <RangePicker
          className="h-12"
          format={"DD/MM/YYYY"}
          onChange={(_dates, dateStrings) => {
            setStartDate(dateStrings[0]);
            setEndDate(dateStrings[1]);
          }}
        />
      </div>

      {loading ? (
        <SpinningLogo />
      ) : (
        sellers && (
          <div className="overflow-x-auto flex flex-col gap-6">
            <Table
              data={sellers.data}
              headers={[
                { label: "Vendedor(a)", key: "sellerName" },
                { label: "Caixas vendidas", key: "boxSold" },
                { label: "Unidades vendidas", key: "unitSold" },
              ]}
            />
            <Pagination
              currentPage={sellers.currentPage}
              totalItems={sellers.totalItems}
              totalPages={sellers.totalPages}
              limit={sellers.data.length}
              handlePageClick={handlePageClick}
            />
          </div>
        )
      )}
    </div>
  );
}
