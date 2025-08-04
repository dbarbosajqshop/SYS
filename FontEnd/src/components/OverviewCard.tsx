import { IconButton } from "@/ui/IconButton";
import { Heading } from "@/ui/typography/Heading";
import { Paragraph } from "@/ui/typography/Paragraph";
import React from "react";
import { DashboardBadge } from "./DashboardBadge";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: string | number;
  icon: React.ReactElement<{ color: string; height: number; width: number }>;
  dashboardNumber?: number;
  className?: string;
  iconSize?: "small" | "large" | "medium";
  disabled?: boolean | undefined;
};

export const OverviewCard = ({
  title,
  value,
  icon,
  dashboardNumber,
  iconSize,
  className,
  disabled,
}: Props) => {
  return (
    <div
      className={cn(
        "flex justify-between  items-center  bg-neutral-0 w-full gap-4 sm:min-w-[252px]  sm:w-auto h-[89px] sm:h-[118px] rounded-nano border p-sm",
        className,
        disabled ? "opacity-50" : ""
      )}
    >
      <div className="truncate">
        <Paragraph
          variant="large"
          color="text-neutral-500"
          className="truncate"
        >
          {title}
        </Paragraph>
        <Heading variant="medium-semibold">{value}</Heading>
        {dashboardNumber && <DashboardBadge number={dashboardNumber} />}
      </div>

      <IconButton size={iconSize || "large"} variant="filled">
        {icon}
      </IconButton>
    </div>
  );
};
