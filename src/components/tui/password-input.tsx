"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Box, type BoxProps } from "./box";
import { useId, useState } from "react";

const PasswordInput = ({
  box,
  ...props
}: { box: BoxProps } & React.ComponentProps<"input">) => {
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);
  return (
    <Box {...box}>
      <div className="relative">
        <input
          {...props}
          id={id}
          type={isVisible ? "text" : "password"}
          className="text-foreground w-full min-w-0 text-sm outline-none focus:ring-0 focus:ring-offset-0"
        />
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          {isVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>
    </Box>
  );
};

export { PasswordInput };
