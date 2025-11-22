"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import type { CaptionProps } from "react-day-picker";
import { useDayPicker } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function CustomCaption({ calendarMonth, displayIndex }: CaptionProps) {
  const { goToMonth } = useDayPicker();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"month" | "year">("month");

  const displayDate = calendarMonth.date;
  const currentYear = displayDate.getFullYear();
  const currentMonth = displayDate.getMonth();

  const minYear = currentYear - 100;
  const maxYear = currentYear + 20;
  const totalYears = maxYear - minYear + 1;
  const yearsPerPage = 9;
  const totalPages = Math.ceil(totalYears / yearsPerPage);

  const getCurrentYearPage = () => {
    return Math.floor((currentYear - minYear) / yearsPerPage);
  };

  const [yearPage, setYearPage] = useState(getCurrentYearPage());

  const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];

  const getYearPageYears = () => {
    const startYear = minYear + yearPage * yearsPerPage;
    const endYear = Math.min(startYear + yearsPerPage - 1, maxYear);
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i,
    );
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentYear, month, 1);
    goToMonth(newDate);
    setIsOpen(false);
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, currentMonth, 1);
    goToMonth(newDate);
    setView("month");
  };

  const handleYearPageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && yearPage > 0) {
      setYearPage(yearPage - 1);
    } else if (direction === "next" && yearPage < totalPages - 1) {
      setYearPage(yearPage + 1);
    }
  };

  const yearPageYears = getYearPageYears();
  const paddedYears: (number | null)[] = [...yearPageYears];
  while (paddedYears.length < 9) {
    paddedYears.push(null);
  }

  return (
    <div
      className="flex h-8 w-full items-center justify-center"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (open) {
            setView("month");
          }
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="hover:bg-accent focus:ring-ring relative z-10 flex h-8 cursor-pointer items-center justify-center gap-1 rounded-md px-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            style={{ pointerEvents: "auto" }}
          >
            {monthNames[currentMonth]} {currentYear}
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="center">
          {view === "month" ? (
            <div className="space-y-2">
              <div className="text-center text-sm font-medium">Monat</div>
              <div className="grid grid-cols-3 gap-1">
                {monthNames.map((month, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    onClick={() => handleMonthSelect(index)}
                    className={cn(
                      "h-9 w-16 text-xs",
                      index === currentMonth &&
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    )}
                  >
                    {month.slice(0, 3)}
                  </Button>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full text-sm"
                onClick={() => {
                  setYearPage(getCurrentYearPage());
                  setView("year");
                }}
              >
                Jahr auswählen
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleYearPageChange("prev")}
                  disabled={yearPage === 0}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <div className="text-center text-sm font-medium">
                  {minYear + yearPage * yearsPerPage} -{" "}
                  {Math.min(
                    minYear + yearPage * yearsPerPage + yearsPerPage - 1,
                    maxYear,
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleYearPageChange("next")}
                  disabled={yearPage >= totalPages - 1}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {paddedYears.map((year, index) => (
                  <Button
                    key={year ?? `empty-${index}`}
                    type="button"
                    variant="ghost"
                    onClick={() => year && handleYearSelect(year)}
                    disabled={!year}
                    className={cn(
                      "h-9 w-16 text-xs",
                      year === currentYear &&
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      !year && "invisible",
                    )}
                  >
                    {year}
                  </Button>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full text-sm"
                onClick={() => setView("month")}
              >
                Monat auswählen
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function DatePicker({
  defaultValue,
  onSelect,
  id,
  ...props
}: {
  defaultValue?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  id?: string;
} & Omit<
  React.ComponentProps<typeof Calendar>,
  "mode" | "selected" | "onSelect"
>) {
  const [date, setDate] = useState<Date | undefined>(defaultValue);
  const [open, setOpen] = useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onSelect?.(selectedDate);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Datum auswählen</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          captionLayout="dropdown"
          components={{
            MonthCaption: CustomCaption,
            ...props.components,
          }}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}
