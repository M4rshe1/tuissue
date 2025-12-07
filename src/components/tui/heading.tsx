import { cn } from "@/lib/utils";

const H1 = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.HTMLAttributes<HTMLHeadingElement>;
}) => {
  return (
    <h1 className={cn("text-h1 text-base font-bold", className)} {...props}>
      # {children}
    </h1>
  );
};

const H2 = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.HTMLAttributes<HTMLHeadingElement>;
}) => {
  return (
    <h2 className={cn("text-h2 text-base font-bold", className)} {...props}>
      ## {children}
    </h2>
  );
};

const H3 = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.HTMLAttributes<HTMLHeadingElement>;
}) => {
  return (
    <h3 className={cn("text-h3 text-base font-bold", className)} {...props}>
      ### {children}
    </h3>
  );
};

const H4 = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.HTMLAttributes<HTMLHeadingElement>;
}) => {
  return (
    <h4 className={cn("text-h4 text-base font-bold", className)} {...props}>
      #### {children}
    </h4>
  );
};

const H5 = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.HTMLAttributes<HTMLHeadingElement>;
}) => {
  return (
    <h5 className={cn("text-h5 text-base font-bold", className)} {...props}>
      ##### {children}
    </h5>
  );
};

const H6 = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  props?: React.HTMLAttributes<HTMLHeadingElement>;
}) => {
  return (
    <h6 className={cn("text-h6 text-base font-bold", className)} {...props}>
      ###### {children}
    </h6>
  );
};

export { H1, H2, H3, H4, H5, H6 };
