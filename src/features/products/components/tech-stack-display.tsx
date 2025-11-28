"use client";

import { TechIcon } from "./tech-icon";

interface TechStackDisplayProps {
  techstack: string[];
  title?: string;
}

export function TechStackDisplay({ techstack, title = "Built with" }: TechStackDisplayProps) {
  if (!techstack || techstack.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {techstack.map((tech) => (
          <div
            key={tech}
            className="inline-flex items-center gap-1.5 bg-muted/50 border rounded-md px-2 py-1"
          >
            <TechIcon name={tech} className="size-4" />
            <span className="text-xs">{tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

