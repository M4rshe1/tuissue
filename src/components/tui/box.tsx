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
    <div className={cn("bg-card relative h-full w-full p-2.5", className)}>
      {text?.topLeft && (
        <div className="bg-card absolute top-0 left-4 px-1 text-xs font-bold">
          {text.topLeft}
        </div>
      )}
      {text?.topRight && (
        <div className="bg-card absolute top-0 right-4 px-1 text-xs font-bold">
          {text.topRight}
        </div>
      )}
      {text?.bottomLeft && (
        <div className="bg-card absolute bottom-0 left-4 px-1 text-xs font-bold">
          {text.bottomLeft}
        </div>
      )}
      {text?.bottomRight && (
        <div className="bg-card absolute right-4 bottom-0 px-1 text-xs font-bold">
          {text.bottomRight}
        </div>
      )}
      <div className="h-full w-full rounded-xs p-2.5 ring-2">{children}</div>
    </div>
  );
};
