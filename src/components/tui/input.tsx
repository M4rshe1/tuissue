import { Box, type BoxProps } from "./box";
import { cn } from "@/lib/utils";
const Input = ({
  box,
  className,
  ...props
}: { box?: BoxProps } & React.ComponentProps<"input">) => {
  return (
    <Box
      {...{
        ...box,
        style: {
          box: cn("has-[input:focus]:text-primary", box?.style?.box),
        },
      }}
    >
      <input
        {...props}
        className={cn(
          "text-foreground w-full min-w-0 text-sm outline-none focus:ring-0 focus:ring-offset-0",
          className,
        )}
      />
    </Box>
  );
};

export { Input };
