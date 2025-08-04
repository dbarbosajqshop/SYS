import React from 'react';
import { Caption } from '@/ui/typography/Caption'; 

type StatusBadgeProps = {
  status?: string;
  displayText?: string; 
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, displayText }) => {
  const normalizedStatus = status ? status.toLowerCase().replace(/ /g, "_") : ""; 

  const getBgColorClass = (s: string) => {
    switch (s) {
      case "entregue": return "bg-success-100 border-success-900";
      case "pendente": return "bg-error-100 border-error-900";
      case "separacao": return "bg-warning-100 border-warning-900";
      case "conferencia": return "bg-[#F6E0FE] border-[#69038D]";
      case "docas": return "bg-info-100 border-info-900";
      case "em_pagamento": return "bg-yellow-100 border-yellow-500";
      case "em_transito": return "bg-blue-100 border-blue-500";
      case "cancelado": return "bg-neutral-200 border-neutral-500";
      case "reembolsado": return "bg-purple-100 border-purple-500";
      default: return "bg-gray-100 border-gray-400";
    }
  };

  const getTextColorClass = (s: string) => {
    switch (s) {
      case "entregue": return "text-success-900";
      case "pendente": return "text-error-900";
      case "separacao": return "text-warning-900";
      case "conferencia": return "text-[#69038D]";
      case "docas": return "text-info-900";
      case "em_pagamento": return "text-yellow-700";
      case "em_transito": return "text-blue-700";
      case "cancelado": return "text-neutral-700";
      case "reembolsado": return "text-purple-700";
      default: return "text-gray-700";
    }
  };

  const getReadableText = (s: string) => {
    switch (s) {
      case "entregue": return "Entregue";
      case "pendente": return "Pendente";
      case "separacao": return "Em Separação";
      case "conferencia": return "Em Conferência";
      case "docas": return "Nas Docas";
      case "em_pagamento": return "Em Pagamento";
      case "em_transito": return "Em Trânsito";
      case "cancelado": return "Cancelado";
      case "reembolsado": return "Reembolsado";
      default: return s.replace(/_/g, " ");
    }
  };

  const badgeText = displayText || getReadableText(normalizedStatus);

  return (
    <div
      className={`inline-flex justify-center items-center px-xs py-quarck rounded-pill border font-semibold
           ${getBgColorClass(normalizedStatus)} ${getTextColorClass(normalizedStatus)}`}
    >
      <Caption variant="large">
        {badgeText}
      </Caption>
    </div>
  );
};