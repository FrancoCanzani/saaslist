"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { tags } from "@/utils/constants";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

interface LabelSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

export function LabelSelector({
  selectedTags,
  onTagsChange,
  maxTags = 3,
}: LabelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelectedTags, setTempSelectedTags] =
    useState<string[]>(selectedTags);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return tags;
    }

    const query = searchQuery.toLowerCase();
    return tags
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
      setTempSelectedTags(selectedTags);
      setSearchQuery("");
    }
    setIsOpen(open);
  };

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Select launch tags
      </button>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-gray-500 hover:text-red-600 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">
                Select launch tags
              </DialogTitle>
              <span className="text-sm text-blue-600 font-medium">
                {tempSelectedTags.length} Selected
              </span>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for categories, platforms and launch tags"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Accordion type="multiple" className="space-y-2">
              {filteredCategories.map((category) => (
                <AccordionItem
                  key={category.name}
                  value={category.name}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 [&[data-state=open]]:bg-gray-50">
                    <div className="flex items-center justify-between w-full pr-2">
                      <span className="font-medium text-sm">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {category.tags.length}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2">
                    <div className="flex flex-wrap gap-2">
                      {category.tags.map((tag) => {
                        const isSelected = tempSelectedTags.includes(tag);
                        const isDisabled =
                          !isSelected && tempSelectedTags.length >= maxTags;

                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleTagClick(tag)}
                            disabled={isDisabled}
                            className={`
                              px-3 py-1.5 rounded-md text-sm font-medium transition-all
                              ${
                                isSelected
                                  ? "bg-red-50 border-2 border-red-500 text-red-700"
                                  : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
                              }
                              ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                            `}
                          >
                            <span className="flex items-center gap-1.5">
                              {isSelected && (
                                <Plus className="w-3 h-3 rotate-45" />
                              )}
                              {tag}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredCategories.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-sm">
                  No tags found matching &quot;{searchQuery}&quot;
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-md transition-colors"
            >
              Save launch tags
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
