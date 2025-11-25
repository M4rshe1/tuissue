import React from "react";
import { cn } from "@/lib/utils";

export function Loading({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex h-20 w-full items-center justify-center", className)}
      {...props}
    >
      <span className="grid grid-cols-6 gap-1">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="animate-braille-loading block h-4 w-2 rounded-full"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </span>
      <style>{`
        @keyframes braille-loading {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          40% { opacity: 1; transform: scaleY(1.6); }
          80% { opacity: 0.3; transform: scaleY(1); }
        }
        .animate-braille-loading {
          animation: braille-loading 1s infinite;
        }
      `}</style>
    </div>
  );
}
