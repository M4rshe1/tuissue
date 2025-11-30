import { Box, type BoxProps } from "./box";

const Input = ({
  box,
  ...props
}: { box?: BoxProps } & React.ComponentProps<"input">) => {
  return (
    <Box {...box}>
      <input
        {...props}
        className="text-foreground w-full min-w-0 text-sm outline-none focus:ring-0 focus:ring-offset-0"
      />
    </Box>
  );
};

export { Input };
