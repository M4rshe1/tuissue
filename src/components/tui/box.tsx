import { cn } from "@/lib/utils";

export const Box = ({
  children,
  className,
  text,
}: React.ComponentProps<"div"> & {
  children: React.ReactNode;
  className?: string;
  text?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };
}) => {
  return (
    <div className={cn("bg-card relative w-full p-2", className)}>
      {text?.topLeft && (
        <div className="bg-card absolute top-0 left-3 px-1 text-xs font-bold">
          {text.topLeft}
        </div>
      )}
      {text?.topRight && (
        <div className="bg-card absolute top-0 right-3 px-1 text-xs font-bold">
          {text.topRight}
        </div>
      )}
      {text?.bottomLeft && (
        <div className="bg-card absolute bottom-0 left-3 px-1 text-xs font-bold">
          {text.bottomLeft}
        </div>
      )}
      {text?.bottomRight && (
        <div className="bg-card absolute right-3 bottom-0 px-1 text-xs font-bold">
          {text.bottomRight}
        </div>
      )}
      {children}
    </div>
  );
};
