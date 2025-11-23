"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { categories } from "@/utils/constants";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ProductTagsSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

export default function ProductTagsSelector({
  selectedTags,
  onTagsChange,
  maxTags = 3,
}: ProductTagsSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedTags, setTempSelectedTags] =
    useState<string[]>(selectedTags);

  useEffect(() => {
    if (isOpen) {
      setTempSelectedTags(selectedTags);
    }
  }, [isOpen, selectedTags]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories;
    }

    const query = searchQuery.toLowerCase();
    return categories
      .map((category) => ({
        ...category,
        tags: category.tags.filter(
          (tag) =>
            tag.toLowerCase().includes(query) ||
            category.name.toLowerCase().includes(query),
        ),
      }))
      .filter(
        (category) =>
          category.tags.length > 0 ||
          category.name.toLowerCase().includes(query),
      );
  }, [searchQuery]);

  const handleTagClick = (tag: string) => {
    if (tempSelectedTags.includes(tag)) {
      setTempSelectedTags(tempSelectedTags.filter((t) => t !== tag));
    } else if (tempSelectedTags.length < maxTags) {
      setTempSelectedTags([...tempSelectedTags, tag]);
    }
  };

  const handleSave = () => {
    onTagsChange(tempSelectedTags);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSearchQuery("");
    }
    setIsOpen(open);
  };

  const handleClearAll = () => {
    onTagsChange([]);
    setTempSelectedTags([]);
  };

  const handleTagRemove = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-xl border bg-transparent px-2 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "hover:border-ring/50 text-left flex items-center justify-between gap-2",
          selectedTags.length === 0 && "text-muted-foreground",
        )}
      >
        <span className="flex-1 rounded-xl flex items-center gap-1.5 flex-wrap">
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => (
              <span
                key={tag}
                onClick={(e) => handleTagRemove(tag, e)}
                className="inline-flex items-center gap-1 rounded-md bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-xs cursor-pointer hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))
          ) : (
            <span>Select tags...</span>
          )}
        </span>
      </button>

      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {selectedTags.length} / {maxTags} selected
          </span>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-700 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-medium">
              Select launch tags
              <span className="text-xs ml-2 text-muted-foreground">
                {tempSelectedTags.length} Selected
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="relative">
            <Input
              type="text"
              placeholder="Search for launch tags"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs rounded-xl"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <Accordion type="multiple" className="space-y-2">
              {filteredCategories.map((category) => (
                <AccordionItem
                  key={category.name}
                  value={category.name}
                  className="overflow-hidden rounded border last:border-b"
                >
                  <AccordionTrigger className="px-2 py-1">
                    <div className="flex items-center space-x-1 text-sm justify-start w-full">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-xs">({category.tags.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-2">
                    <div className="flex flex-wrap gap-2">
                      {category.tags.map((tag) => {
                        const isSelected = tempSelectedTags.includes(tag);
                        const isDisabled =
                          !isSelected && tempSelectedTags.length >= maxTags;

                        return (
                          <Button
                            key={tag}
                            type="button"
                            onClick={() => handleTagClick(tag)}
                            disabled={isDisabled}
                            size={"xs"}
                            variant={"outline"}
                            className={cn(
                              "font-normal transition-all",
                              isSelected && "bg-accent",
                              isDisabled && "opacity-40 cursor-not-allowed"
                            )}
                          >
                            <span className="flex items-center gap-1">
                              {isSelected && <X className="size-3" />}
                              {tag}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredCategories.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-xs">
                  No tags found matching &quot;{searchQuery}&quot;
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" size={"xs"} onClick={handleSave}>
              Save launch tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

