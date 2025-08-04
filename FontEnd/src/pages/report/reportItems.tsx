import { SpinningLogo } from "@/icons/SpinningLogo";
import { Pagination } from "@/ui/Pagination";
import { Table } from "@/ui/Table";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Column } from "@/components/column";
import { Row } from "@/components/row";
import { useReportItems } from "./useReportItems";
import { DatePicker, Input } from "antd";
import { IoSearchSharp } from "react-icons/io5";
import dayjs from "dayjs";
import { Caption } from "@/ui/typography/Caption";
import { formatCurrencyText } from "@/helpers";
import { IconButton } from "@/ui/IconButton";
import { ArrowBack } from "@/icons/ArrowBack";
import { useNavigate } from "react-router-dom";

export const ReportItems = () => {
  const { items, setPage, setSearch, setSelectedMonth } = useReportItems();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col gap-6 bg-neutral-100 h-full">
        <div className="flex items-center gap-3 py-sm px-sm sm:px-md"> 
          <IconButton
            size="large"
            iconColor="#71717A"
            onClick={() => navigate("/report")} 
          >
            <ArrowBack />
          </IconButton>
          <Subtitle variant="medium" color="text-neutral-500">
            Relatórios / Itens
          </Subtitle>
        </div>
        <Row>
          <div className="flex flex-col min-w-[75%] min-h-[50vh] gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
            <Column className="gap-4">
              <Row className="items-center">
                <Subtitle variant="large-semibold" color="text-neutral-800">
                  Items
                </Subtitle>
                <Subtitle
                  variant="small-semibold"
                  color="text-neutral-700"
                  className="ml-auto mr-3"
                >
                  Filtros
                </Subtitle>
                <DatePicker
                  size="large"
                  allowClear={false}
                  defaultValue={dayjs()}
                  maxDate={dayjs()}
                  onChange={(date) => setSelectedMonth(date)}
                  picker="month"
                />

                <Input
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-[300px] "
                  placeholder="Pesquisar por nome, sku, ou codigo de barras... "
                  size="large"
                  prefix={<IoSearchSharp />}
                />
              </Row>
            </Column>
            {items ? (
              items.data ? (
                <>
                  <Table
                    data={items.data || []}
                    headers={[
                      { label: "Item", key: "itemName" },
                      { label: "Sku", key: "itemSku" },
                      { label: "Preço", key: "price" },
                      { label: "Vendas Realizadas", key: "timesOrdered" },
                      { label: "Quantidade Vendida", key: "totalQuantitySold" },
                      { label: "Valor Total de Vendas", key: "totalSales" },
                    ]}
                    imageField="itemImageUrl"
                    dateFields={["createdAt"]}
                    monetaryFields={["totalPrice"]}
                    deleteTitle="Você tem certeza que deseja excluir essa venda?"
                    deleteDescription="Ao excluir essa venda não será possível recupera-la e ela será excluída da suas métricas de venda "
                  />
                  <Pagination
                    currentPage={items?.pagination.currentPage}
                    totalItems={items?.pagination.totalItems}
                    totalPages={items?.pagination.totalPages}
                    limit={items?.pagination.itemsPerPage}
                    handlePageClick={(page) => setPage(page)}
                  />
                </>
              ) : (
                <SpinningLogo />
              )
            ) : (
              <div className="my-auto h-1/2 bg-neu">
                <SpinningLogo />
              </div>
            )}
          </div>{" "}
          <Column className="items-start justify-start h-full max-w-xl w-1/3 gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano ">
            <Subtitle variant="large-semibold">Top 10</Subtitle>
            <div className="grid grid-cols gap-3">
              {items.top10Items?.map((item, index) => (
                <Row>
                  <Subtitle variant="large-semibold" color="text-neutral-500">
                    {index + 1}º
                  </Subtitle>
                  <img
                    src={item.itemImageUrl || "/no-image.jpeg"}
                    alt="Ícone"
                    className="w-12 h-12 border object-cover rounded"
                  />
                  <Column className="truncate">
                    <Caption
                      variant="large-semibold"
                      color="text-neutral-800"
                      className=""
                    >
                      {item.itemName}
                    </Caption>
                    <Row>
                      <Caption
                        variant="large-semibold"
                        color="text-neutral-600"
                      >
                        {item.totalQuantitySold} Unidades
                      </Caption>{" "}
                      -{" "}
                      <Caption variant="large" color="text-neutral-600">
                        {formatCurrencyText(
                          item?.totalSales.toFixed(2).toString()
                        )}
                      </Caption>
                    </Row>
                  </Column>
                </Row>
              ))}
            </div>
          </Column>
        </Row>
      </div>
    </>
  );
};