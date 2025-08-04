import { Select, Option } from "@/ui/Select";
import React from "react";

type Props = {
  onClose: () => void;
  onSelectFilter: (filter: string) => void;
  selectedFilter: string;
  filterOptions: Option[];
  children?: React.ReactNode; 
};

export const FilterOptions = ({ onClose, onSelectFilter, selectedFilter, filterOptions, children }: Props) => {
  return (
    <div className="absolute mt-2 right-3 p-4 border border-neutral-200 rounded-nano bg-white shadow-lg z-50 min-w-[250px]">
      <div className="mb-4">
        <Select
          label="Filtrar por"
          data={selectedFilter}
          options={filterOptions}
          onChange={(e) => {
            onSelectFilter(e.target.value);
            onClose(); 
          }}
          wide
        />
      </div>
      {children} 
    </div>
  );
};