import React from 'react';

export type TableHeader = {
  label: string;
  key: string;
  cellClassName?: string;
  headerClassName?: string;
  render?: (value: unknown, row: unknown) => React.ReactNode;
};