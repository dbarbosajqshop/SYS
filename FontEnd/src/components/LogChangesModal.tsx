import React from "react";
import { Close } from "@/icons/Close";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Paragraph } from "@/ui/typography/Paragraph";
import { IAuditLogChange } from "@/types/auditLogs";
import { formatChange, formatAction } from "@/helpers/logFormatters";
import { Button } from "@/ui/Button";

type LogChangesModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  logDetails: {
    action?: string;
    userId?: string | { _id: string; name?: string; email?: string };
    targetId?: string | { _id: string; name?: string; code?: string; orderNumber?: string };
    targetType?: string;
    targetName?: string;
    timestamp?: string;
    createdAt?: string;
    changes: IAuditLogChange[];
  } | null;
};

export const LogChangesModal: React.FC<LogChangesModalProps> = ({
  open,
  setOpen,
  logDetails,
}) => {
  if (!open || !logDetails) return null;

  const handleClose = () => setOpen(false);

  const dateSource = logDetails.createdAt || logDetails.timestamp;
  const formattedTimestamp = dateSource
    ? new Date(dateSource).toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    : "N/A";

  const displayUserId =
    typeof logDetails.userId === 'object' && logDetails.userId !== null
      ? logDetails.userId.name || logDetails.userId.email || logDetails.userId._id
      : logDetails.userId;

  const displayTargetId =
    typeof logDetails.targetId === 'object' && logDetails.targetId !== null
      ? logDetails.targetId.name || logDetails.targetId.code || logDetails.targetId.orderNumber || logDetails.targetId._id
      : logDetails.targetId;

  const captionLabelClasses = "text-base font-semibold text-neutral-900";

  return (
    <div
      className={`fixed p-10 left-0 top-0 z-50 flex h-screen w-screen items-center justify-center
       bg-black bg-opacity-50 ${open ? "" : "hidden"} `}
    >
      <div className="w-auto sm:w-[700px] overflow-y-auto max-h-full pb-3 bg-neutral-0 rounded-sm border border-neutral-200">
        <div className="flex justify-between h-[77px] p-sm border-b border-neutral-200 items-center">
          <Subtitle variant="large-semibold">Detalhes do Registro</Subtitle>
          <div className="cursor-pointer" onClick={handleClose}>
            <Close />
          </div>
        </div>
        <div className="p-sm flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <Paragraph>
              <span className={captionLabelClasses}>Ação:</span>{" "}
              {formatAction(logDetails.action || 'N/A')}
            </Paragraph>
            <Paragraph>
              <span className={captionLabelClasses}>Usuário:</span>{" "}
              {displayUserId}
            </Paragraph>
            <Paragraph>
              <span className={captionLabelClasses}>Tipo do Alvo:</span>{" "}
              {logDetails.targetType}
            </Paragraph>
            <Paragraph>
              <span className={captionLabelClasses}>Alvo:</span>{" "}
              {logDetails.targetName || displayTargetId}
            </Paragraph>
            <Paragraph className="col-span-2">
              <span className={captionLabelClasses}>Data/Hora:</span>{" "}
              {formattedTimestamp}
            </Paragraph>
          </div>

          <Subtitle variant="large-semibold" className="mt-4 border-t pt-4">Mudanças Detalhadas:</Subtitle>
          {logDetails.changes && logDetails.changes.length > 0 ? (
            <ul className="list-disc pl-5 flex flex-col gap-2">
              {logDetails.changes.map((change, index) => {
                const formattedChange = formatChange(change, logDetails);
                return (
                  <li key={index}>
                    {Array.isArray(formattedChange) ? (
                      <>
                        <Paragraph>
                          <span className={captionLabelClasses}>{formattedChange[0]}</span> 
                        </Paragraph>
                        <ul className="list-circle list-inside pl-4 mt-1"> 
                          {formattedChange.slice(1).map((detail, detailIndex) => (
                            <li key={`${index}-${detailIndex}`} className="text-sm">
                              <Paragraph>{detail}</Paragraph>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Paragraph>
                        {formattedChange}
                      </Paragraph>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <Paragraph>Nenhuma mudança detalhada para este registro.</Paragraph>
          )}
        </div>
        <div className="flex justify-end gap-2 px-sm pt-4 border-t border-neutral-200">
          <Button variant="naked" color="default" onClick={handleClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};