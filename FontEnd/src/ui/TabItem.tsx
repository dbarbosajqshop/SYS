import { useState } from "react";
import { Paragraph } from "./typography/Paragraph";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  url: string;
  active?: boolean;
  onClick?: () => void;
};

export const TabItem = ({ title, url, active = false, onClick }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Link
      to={!active ? url : "#"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      className={`w-[122px] h-[41px] p-nano border-b-2 flex text-nowrap justify-center cursor-pointer ${
        isPressed && !active && "border-neutral-950"
      } ${active && "border-brand-700"}`}
    >
      <Paragraph
        variant={active || isHovered ? "large-semibold" : "large"}
        color={active ? "text-brand-700" : "text-neutral-950"}
      >
        {title}
      </Paragraph>
    </Link>
  );
};
