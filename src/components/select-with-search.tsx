"use client"

import { useId, useState, useMemo } from "react"

import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface SelectWithSearchOption {
  value: string
  label: string
}

export interface SelectWithSearchProps {
  id?: string
  value?: string
  onValueChange?: (value: string) => void
  options: SelectWithSearchOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  label?: string
  className?: string
}

export function SelectWithSearch({
  id,
  value = "",
  onValueChange,
  options,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  label,
  className,
}: SelectWithSearchProps) {
  const generatedId = useId()
  const finalId = id || generatedId
  const [open, setOpen] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")

  // Check if search is a subsequence of the text (characters in order, not necessarily consecutive)
  const isSubsequence = (search: string, text: string): boolean => {
    const searchLower = search.toLowerCase()
    const textLower = text.toLowerCase()
    
    let searchIndex = 0
    for (let i = 0; i < textLower.length && searchIndex < searchLower.length; i++) {
      if (textLower[i] === searchLower[searchIndex]) {
        searchIndex++
      }
    }
    return searchIndex === searchLower.length
  }

  // Filter options by label (visible content) based on search
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options
    
    return options.filter((option) =>
      isSubsequence(search, option.label)
    )
  }, [options, search])

  return (
    <div className={cn("*:not-first:mt-2", className)}>
      {label && <Label htmlFor={finalId}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={finalId}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-input bg-background px-3 font-normal outline-offset-0 outline-none hover:bg-background focus-visible:outline-[3px]"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value
                ? options.find((option) => option.value === value)?.label
                : placeholder}
            </span>
            <ChevronDownIcon
              size={16}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
          onWheel={(e) => {
            // Prevent wheel events from bubbling to dialog overlay
            e.stopPropagation()
          }}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList
              onWheel={(e) => {
                // Ensure wheel events work properly in dialog context
                e.stopPropagation()
              }}
            >
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(selectedValue) => {
                      const newValue =
                        selectedValue === value ? "" : selectedValue
                      onValueChange?.(newValue)
                      setOpen(false)
                      setSearch("")
                    }}
                  >
                    {option.label}
                    {value === option.value && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

