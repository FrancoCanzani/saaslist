"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { techStackCategories, getTechItem } from "@/utils/constants/tech-stack";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { TechIcon } from "../tech-icon";

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

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return techStackCategories;
    }

    const query = searchQuery.toLowerCase();
    return techStackCategories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.name.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.items.length > 0);
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
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search technologies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((tech) => (
            <div
              key={tech}
              className="inline-flex items-center gap-1.5 bg-primary/10 border font-medium rounded-md px-2 py-1 text-xs"
            >
              <TechIcon name={tech} className="size-3.5" />
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

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {filteredCategories.map((category) => (
          <div key={category.name}>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              {category.name}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {category.items.map((item) => {
                const isSelected = selected.includes(item.name);
                const isDisabled = !isSelected && selected.length >= maxTech;

                return (
                  <Button
                    key={item.name}
                    type="button"
                    onClick={() => handleToggle(item.name)}
                    disabled={isDisabled}
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "font-normal text-xs h-7 gap-1.5",
                      isDisabled && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    <TechIcon name={item.name} className="size-3.5" grayscale={isSelected} />
                    {item.name}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
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
