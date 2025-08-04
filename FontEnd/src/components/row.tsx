import { cn } from "@/lib/utils";

type RowProps = React.HTMLAttributes<HTMLDivElement>;

export const Row = ({ className, children, ...props }: RowProps) => {
  return (
    <div
      {...props}
      className={cn(
        "flex items-center gap-1 transition-all sm:gap-2",
        className
      )}
    >
      {children}
    </div>
  );
};
