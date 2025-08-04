import { Paragraph } from "@/ui/typography/Paragraph";
import React from "react";
import { Link } from "react-router-dom";

type Props = {
  label: string;
  url: string;
  active?: boolean;
  icon: React.ReactNode;
  isCollapsed?: boolean;
  onClick?: () => void;
};

export const SideNavigationItem = ({
  label,
  url,
  active = false,
  icon,
  isCollapsed = false,
  onClick,
}: Props) => {
  return (
    <Link
      className={`flex items-center py-xs px-xxs gap-2 transition-all duration-300 ${
        isCollapsed ? "w-min" : "w-[232px]"
      } h-12 ${active ? "bg-brand-700" : "bg-neutral-0"} rounded-nano cursor-pointer ${
        !active && "hover:bg-brand-100"
      }`}
      to={url}
      onClick={onClick}
    >
      {icon}
      {!isCollapsed && (
        <Paragraph
          variant={active ? "large-semibold" : "large"}
          color={active ? "text-neutral-0" : "text-neutral-400"}
        >
          {label}
        </Paragraph>
      )}
    </Link>
  );
};
