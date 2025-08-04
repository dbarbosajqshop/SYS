import { useEffect, useState } from "react";
import { Input } from "./Input";
import { Caption } from "./typography/Caption";
import ReactPaginate from "react-paginate";
import { useDebounce } from "use-debounce";

type Props = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  handlePageClick: (selected: number) => void;
};

export const Pagination = ({
  totalItems,
  totalPages,
  currentPage,
  limit,
  handlePageClick,
}: Props) => {
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const [dPageInput] = useDebounce(pageInput, 1000);

  const handlePageInput = (e: string) =>
    !isNaN(Number(e)) && Number(e) <= totalPages && setPageInput(e);

  useEffect(() => {
    if (
      dPageInput &&
      Number(dPageInput) !== currentPage &&
      Number(dPageInput) > 0 &&
      Number(dPageInput) <= totalPages
    )
      handlePageClick(Number(dPageInput));
  }, [dPageInput]);

  return (
    <div className="flex justify-between items-center flex-wrap sm:flex-nowrap gap-2 sm:gap-0">
      <div className="flex items-center gap-2 sm:gap-4">
        <Caption variant="large" color="text-neutral-500">
          Página {currentPage} de {totalPages} - ({limit} de {totalItems} Resultados)
        </Caption>
        {totalPages > 1 && (
          <>
            <Caption variant="large" color="text-neutral-500">
              Ir para a página:
            </Caption>
            <Input
              data={pageInput}
              onChange={(e) => handlePageInput(e.target.value)}
              className="w-10 h-6 border border-neutral-300 rounded-md"
            />
          </>
        )}
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel={">"}
        onPageChange={({ selected }) => handlePageClick(selected + 1)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        pageCount={totalPages || 0}
        forcePage={currentPage - 1}
        pageLinkClassName="h-10 w-10 flex justify-center items-center rounded-full"
        nextLinkClassName="h-10 w-10 flex justify-center items-center rounded-full"
        previousLinkClassName="h-10 w-10 flex justify-center items-center rounded-full"
        previousLabel={"<"}
        renderOnZeroPageCount={null}
        activeClassName="bg-brand-600 text-white"
        containerClassName={`flex gap-1 sm:gap-2 items-center justify-center font-bold bg-white text-neutral-950`}
        pageClassName={`h-10 w-10 flex justify-center items-center rounded-full border-2`}
        previousClassName={`h-10 w-10 flex justify-center items-center bg-white text-gray-600 font-bold border-neutral-200 rounded-full border-2 `}
        nextClassName={`h-10 w-10 flex justify-center items-center bg-white border-2 text-gray-600 font-bold border-neutral-200 rounded-full`}
      />
    </div>
  );
};
