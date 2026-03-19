"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ConstituencyComboboxProps {
  value: string;
  onChange: (value: string) => void;
  constituencies: string[];
  placeholder?: string;
  className?: string;
}

export function ConstituencyCombobox({
  value,
  onChange,
  constituencies,
  placeholder = "Select constituency...",
  className,
}: ConstituencyComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Create options with "all" prepended
  const options = React.useMemo(() => {
    return [
      { value: "all", label: "All Constituencies" },
      ...constituencies.map((constituency) => ({
        value: constituency,
        label: constituency,
      })),
    ];
  }, [constituencies]);

  const selectedLabel = options.find((option) => option.value === value)?.label || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between h-9", className)}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search constituency..." />
          <CommandList>
            <CommandEmpty>No constituency found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
