import { Link } from "react-router-dom";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Paragraph } from "@/ui/typography/Paragraph";
import { ArrowRight } from "@/icons/ArrowRight"; 

interface ReportCardProps {
  title: string;
  description: string;
  to: string;
  icon?: React.ReactNode; 
}

export const ReportCard = ({ title, description, to, icon }: ReportCardProps) => {
  return (
    <Link to={to} className="flex flex-col gap-3 p-4 bg-neutral-0 border border-neutral-200 rounded-nano shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out cursor-pointer">
      <div className="flex items-center gap-3">
        {icon && <div className="text-primary-500">{icon}</div>}
        <Subtitle variant="large-semibold" color="text-neutral-800">
          {title}
        </Subtitle>
      </div>
      <Paragraph variant="large" color="text-neutral-600"> 
        {description}
      </Paragraph>
      <div className="ml-auto text-primary-500">
        <ArrowRight /> 
      </div>
    </Link>
  );
};