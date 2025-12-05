import * as React from "react";

import { cn } from "@/lib/utils";
import { Box, type BoxProps } from "./box";

function Textarea({
  box,
  className,
  ...props
}: { box?: BoxProps } & React.ComponentProps<"textarea">) {
  return (
    <Box {...box}>
      <textarea
        data-slot="textarea"
        className={cn(
          "text-foreground w-full min-w-0 resize-none border-0! bg-transparent p-0 text-sm shadow-none outline-none focus:border-0! focus:shadow-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:border-0! focus-visible:shadow-none focus-visible:ring-0! focus-visible:ring-offset-0 focus-visible:ring-offset-0! focus-visible:outline-none!",
          className,
        )}
        {...props}
      />
    </Box>
  );
}

export { Textarea };
