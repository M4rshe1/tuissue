import {
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableHead } from "@/components/ui/table";
import { Box, type BoxProps } from "../box";
import type { tableProps } from "./types";
import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Table = <T,>({
  data,
  columns,
  box,
}: tableProps<T> & { box?: BoxProps }) => {
  const [sortConfig, setSortConfig] = useState<
    {
      key: string;
      direction: "asc" | "desc" | null;
    }[]
  >([]);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  const sortedData = useMemo(() => {
    if (sortConfig.length === 0) return data;

    const sorted = [...data].sort((a, b) => {
      for (const config of sortConfig) {
        const aValue = (a as any)[config.key];
        const bValue = (b as any)[config.key];

        let comparison = 0;

        if (typeof aValue === "string" && typeof bValue === "string") {
          comparison = aValue.localeCompare(bValue);
        } else if (aValue < bValue) {
          comparison = -1;
        } else if (aValue > bValue) {
          comparison = 1;
        }

        if (comparison !== 0) {
          return config.direction === "asc" ? comparison : -comparison;
        }
      }

      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      let sorters: { key: string; direction: "asc" | "desc" | null }[] = [];
      if (isCtrlPressed) {
        const isKeyExists = current.some((item) => item.key === key);
        if (isKeyExists) {
          sorters = current.map((item) => {
            if (item.key === key) {
              return {
                ...item,
                direction: item.direction === "asc" ? "desc" : "asc",
              };
            } else {
              return item;
            }
          });
        } else {
          sorters = [...current, { key, direction: "asc" }];
        }
      } else {
        if (current.length === 1 && current[0]?.key === key) {
          sorters = [
            {
              key,
              direction:
                current[0]?.direction === "asc"
                  ? "desc"
                  : current[0]?.direction === "desc"
                    ? null
                    : "asc",
            },
          ];
        } else {
          sorters = [{ key, direction: "asc" }];
        }
      }
      return sorters.filter((item) => item.direction !== null);
    });
  };

  const getSortIcon = (key: string) => {
    const config = sortConfig.find((item) => item.key === key);
    if (!config) return <ArrowUpDown className="ml-1 size-3.5" />;
    const keys = Object.values(sortConfig).map((item) => item.key);
    const icon =
      config.direction === "asc" ? (
        <ArrowUp className="ml-1 size-3" />
      ) : (
        <ArrowDown className="ml-1 size-3.5" />
      );
    return (
      <div className="flex items-center">
        {icon}
        {keys.length > 1 && (
          <span className="text-muted-foreground ml-1 size-3.5 text-xs">
            {keys.indexOf(key) + 1}
          </span>
        )}
      </div>
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        setIsCtrlPressed(true);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.ctrlKey) {
        setIsCtrlPressed(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [sortConfig]);

  return (
    <Box
      {...{
        ...box,
        style: {
          content: cn("p-0", box?.style?.content),
          background: cn("bg-background", box?.style?.background),
        },
      }}
    >
      <table className="w-full">
        <TableHeader className="border-none">
          <TableRow className="hover:bg-transparent">
            {columns.map((column, idx) => (
              <TableHead
                {...(column.key !== "actions" && {
                  onClick: () => handleSort(column.key as string),
                })}
                className="hover:text-foreground hover:bg-muted/50 cursor-pointer p-1 text-sm font-bold hover:underline"
                key={idx}
              >
                <div className="hover:text-foreground flex items-center transition-colors">
                  {column.header ? (
                    column.header(getSortIcon(column.key as string))
                  ) : (
                    <>
                      {column.label}
                      {column.key !== "actions" &&
                        getSortIcon(column.key as string)}
                    </>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="text-sm">
          {sortedData?.length > 0 ? (
            sortedData?.map((row, index) => (
              <TableRow className="border-none" key={index}>
                {columns.map((column) => (
                  <TableCell className="p-1" key={column.key as string}>
                    {column.cell?.(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </table>
    </Box>
  );
};

export default Table;
