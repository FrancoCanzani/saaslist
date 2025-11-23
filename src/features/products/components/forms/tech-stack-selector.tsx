"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { techStackOptions } from "@/utils/constants";
import { X } from "lucide-react";
import { useMemo, useState } from "react";

interface TechStackSelectorProps {
  selected: string[];
  onChange: (tech: string[]) => void;
  maxTech?: number;
}

export function TechStackSelector({
  selected,
  onChange,
  maxTech = 10,
}: TechStackSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTech = useMemo(() => {
    if (!searchQuery.trim()) {
      return techStackOptions;
    }

    const query = searchQuery.toLowerCase();
    return techStackOptions.filter((tech) =>
      tech.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleToggle = (tech: string) => {
    if (selected.includes(tech)) {
      onChange(selected.filter((t) => t !== tech));
    } else if (selected.length < maxTech) {
      onChange([...selected, tech]);
    }
  };

  const removeTech = (tech: string) => {
    onChange(selected.filter((t) => t !== tech));
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search technologies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((tech) => (
            <div
              key={tech}
              className="inline-flex items-center gap-1.5 bg-primary/10 border font-medium rounded-md px-2.5 py-1 text-sm"
            >
              <span>{tech}</span>
              <button
                type="button"
                onClick={() => removeTech(tech)}
                className="hover:bg-primary/20 rounded p-0.5"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="flex flex-wrap gap-2">
          {filteredTech.map((tech) => {
            const isSelected = selected.includes(tech);
            const isDisabled = !isSelected && selected.length >= maxTech;

            return (
              <Button
                key={tech}
                type="button"
                onClick={() => handleToggle(tech)}
                disabled={isDisabled}
                size="sm"
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "font-normal",
                  isDisabled && "opacity-40 cursor-not-allowed"
                )}
              >
                {tech}
              </Button>
            );
          })}
        </div>

        {filteredTech.length === 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No technologies found
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {selected.length} / {maxTech} selected
        </div>
      )}
    </div>
  );
}

