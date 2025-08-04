/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { Caption } from "./typography/Caption";
import { IconButton } from "./IconButton";
import { Dots } from "@/icons/Dots";
import { TableDialog } from "@/components/TableDialog";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { getNestedValue, formatMoney } from "@/helpers";
import { CompareArrows } from "@/icons/CompareArrows";
import { IGetRole } from "@/types/roles";
import { IGetPayment } from "@/types/orders";
import { Heading } from "./typography/Heading";
import { StatusBadge } from "@/components/StatusBadge";

type Props = {
  headers: {
    label: string;
    key: string;
    cellClassName?: string;
    render?: (value: unknown, row: any) => React.ReactNode;
  }[];
  data: any[];
  actionButton?: boolean;
  transferButton?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (edit: boolean) => void;
  onDetail?: (item?: any) => void;
  onSeparation?: () => void;
  onReview?: () => void;
  onVoucher?: () => void;
  onDeliver?: () => void;
  onTransfer?: (item: any) => void;
  onDock?: () => void;
  onPaymentDetail?: () => void;
  deleteTitle?: string;
  deleteDescription?: string;
  setSelectId?: (id: string) => void;
  customMappings?: Record<string, Record<string, string>>;
  monetaryFields?: string[];
  dateFields?: string[];
  imageField?: string;
  detailText?: string;
  percentageFields?: string[];
  editLabel?: string;
  footerContent?: React.ReactNode; 
};

export const Table = ({
  headers,
  data,
  actionButton = false,
  transferButton = false,
  onDelete,
  deleteDescription,
  deleteTitle,
  setSelectId,
  onEdit,
  onDetail,
  onSeparation,
  onReview,
  onVoucher,
  onTransfer,
  onDeliver,
  onDock,
  onPaymentDetail,
  customMappings,
  monetaryFields = [],
  dateFields = [],
  imageField,
  detailText,
  percentageFields,
  editLabel,
  footerContent, 
}: Props) => {
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Record<
    string,
    string | number | boolean | null
  > | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const handleOpenModal = (
    index: number,
    item: Record<string, string | number | boolean | null>,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();

    setModalPosition({
      top: buttonRect.bottom + window.scrollY - 50,
      left: buttonRect.left + window.scrollX - 50,
    });

    setOpenModalIndex(index);
    setSelectedItem(item);

    if (setSelectId && item._id) setSelectId(item._id.toString());
  };

  const handleCloseModal = () => {
    setOpenModalIndex(null);
    setSelectedItem(null);
    setModalPosition(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node))
        handleCloseModal();
    };

    if (openModalIndex !== null)
      document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModalIndex, openDeleteModal]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) =>
      event.key === "Escape" && handleCloseImageModal();

    if (isImageModalOpen) document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isImageModalOpen]);

  if (!data || data.length === 0)
    return (
      <div className="flex justify-center items-center">
        <Heading variant="medium">Nenhum resultado encontrado</Heading>
      </div>
    );

  return (
    <div className="w-full overflow-x-auto">
      {onDelete && (
        <DeleteConfirmationModal
          title={deleteTitle || "Excluir"}
          description={deleteDescription || "Tem certeza que deseja excluir este item?"}
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          onConfirm={() => {
            onDelete(selectedItem?._id?.toString() || "");
            setOpenDeleteModal(false);
            setSelectedItem(null);
          }}
        />
      )}

      <table className="rounded-nano w-full">
        <thead className="bg-neutral-50 border border-neutral-200 h-11 px-sm">
          <tr>
            {imageField && <th></th>}
            {headers.map(({ label, cellClassName }) => (
              <th
                key={label}
                className={`text-left px-3 text-nowrap ${cellClassName || ""}`}
              >
                <Caption variant="large-semibold" color="text-neutral-500">
                  {label}
                </Caption>
              </th>
            ))}
            {transferButton && <th className="px-3 w-10"></th>}
            {actionButton && <th className="px-3 w-10"></th>}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, rowIndex) => {
            return (
              <tr
                key={rowIndex}
                className="h-[52px] border border-neutral-200 text-nowrap"
              >
                {imageField && (
                  <td align="center" className="px-[1px]">
                    <img
                      src={getNestedValue(row, imageField) || "/no-image.jpeg"}
                      alt="Ícone"
                      className={`min-w-8 max-w-8 h-8 object-cover rounded ${
                        getNestedValue(row, imageField) && "cursor-pointer"
                      }`}
                      onClick={
                        getNestedValue(row, imageField)
                          ? () => handleImageClick(getNestedValue(row, imageField))
                          : undefined
                      }
                    />
                  </td>
                )}

                {headers.map(({ key, cellClassName, render }, colIndex) => {
                  let displayValue: any = getNestedValue(row, key);

                  if (render) {
                    displayValue = render(displayValue, row);
                  } else {
                    if (key === "state" || key === "status") {
                      return (
                        <td key={colIndex} className={`px-3 ${cellClassName || ""}`}>
                          <StatusBadge status={String(displayValue)} />
                        </td>
                      );
                    }

                    if (
                      customMappings &&
                      customMappings[key] &&
                      displayValue !== null &&
                      displayValue !== undefined
                    ) {
                      displayValue = customMappings[key][displayValue] ?? displayValue;
                    }

                    if (key === "Roles" || key === "ReceiptPayments") {
                      const mappedItems =
                        Array.isArray(displayValue) && displayValue.length > 0
                          ? displayValue.map((item: IGetRole | IGetPayment) => {
                              if (typeof item === "object" && item !== null) {
                                if ("name" in item && item.name)
                                  return item.name.replace(/_/g, " ");
                                if ("type" in item && item.type) {
                                  switch (item.type) {
                                    case "credito":
                                      return "Cartão de Crédito";
                                    case "debito":
                                      return "Cartão de Débito";
                                    case "keypix":
                                      return "Pix QR Code";
                                    case "machinepix":
                                      return "Pix Maquininha";
                                    case "dinheiro":
                                      return "Dinheiro";
                                    case "ted":
                                      return "TED";
                                    default:
                                      return item.type.replace(/_/g, " ");
                                  }
                                }
                              }
                              return "";
                            })
                          : [];
                      if (Array.isArray(mappedItems)) {
                        displayValue =
                          mappedItems.length > 3
                            ? `${mappedItems.slice(0, 3).join(", ")} e mais ${
                                mappedItems.length - 3
                              }`
                            : mappedItems.join(", ");
                      } else {
                        displayValue = mappedItems;
                      }
                    }

                    if (
                      dateFields?.includes(key) &&
                      displayValue !== null &&
                      displayValue !== undefined
                    ) {
                      try {
                        const dateObj = new Date(displayValue);
                        if (!isNaN(dateObj.getTime())) {
                          displayValue = dateObj.toLocaleString("pt-BR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          });
                        } else {
                          displayValue = "Data Inválida";
                        }
                      } catch {
                        displayValue = "Data Inválida";
                      }
                    } else if (
                      monetaryFields?.includes(key) &&
                      displayValue !== null &&
                      displayValue !== undefined
                    ) {
                      displayValue = formatMoney(displayValue);
                    } else if (
                      percentageFields?.includes(key) &&
                      displayValue !== null &&
                      displayValue !== undefined
                    ) {
                      displayValue = `${displayValue.toString().replace(".", ",")}%`;
                    } else if (
                      displayValue === undefined ||
                      displayValue === null ||
                      displayValue === ""
                    ) {
                      displayValue = "-";
                    }
                  }

                  return (
                    <td key={colIndex} className={`px-3 ${cellClassName || ""}`}>
                      {typeof displayValue === "object" &&
                      displayValue !== null &&
                      React.isValidElement(displayValue) ? (
                        displayValue
                      ) : (
                        <Caption variant="large">{displayValue}</Caption>
                      )}
                    </td>
                  );
                })}

                {transferButton && (
                  <td className="px-3 w-10">
                    <IconButton
                      size="large"
                      onClick={() => onTransfer && onTransfer(row)}
                    >
                      <CompareArrows />
                    </IconButton>
                  </td>
                )}

                {actionButton && (
                  <td className="px-3 w-10">
                    {openModalIndex === rowIndex && modalPosition && (
                      <div
                        ref={dialogRef}
                        style={{
                          position: "absolute",
                          top: `${modalPosition.top}px`,
                          left: `${modalPosition.left}px`,
                          zIndex: 50,
                        }}
                      >
                        <TableDialog
                          onEdit={onEdit ? () => onEdit(true) : undefined}
                          onDelete={onDelete ? () => setOpenDeleteModal(true) : undefined}
                          onDetail={onDetail ? onDetail : undefined}
                          onSeparation={onSeparation ? onSeparation : undefined}
                          onReview={onReview ? onReview : undefined}
                          onVoucher={onVoucher ? onVoucher : undefined}
                          onDeliver={onDeliver ? () => onDeliver() : undefined}
                          onPaymentDetail={onPaymentDetail ? () => onPaymentDetail() : undefined}
                          onDock={onDock ? () => onDock() : undefined}
                          detailText={detailText}
                          editLabel={editLabel}
                        />
                      </div>
                    )}
                    <IconButton
                      size="large"
                      onClick={(event) => handleOpenModal(rowIndex, row, event)}
                    >
                      <Dots />
                    </IconButton>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
        {footerContent && (
          <tfoot className="bg-neutral-50 border border-neutral-200 h-11 px-sm">
            {footerContent}
          </tfoot>
        )}
      </table>

      {isImageModalOpen && selectedImage && (
        <div
          onClick={handleCloseImageModal}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Imagem ampliada"
              className="max-w-full max-h-full rounded"
              width={300}
              height={300}
            />
          </div>
        </div>
      )}
    </div>
  );
};