"use client";

import { getTechItem } from "@/utils/constants/tech-stack";
import { useEffect, useState } from "react";

interface TechIconProps {
  name: string;
  className?: string;
  showName?: boolean;
  grayscale?: boolean;
}

export function TechIcon({ name, className = "size-4", showName = false, grayscale = false }: TechIconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const tech = getTechItem(name);

  useEffect(() => {
    if (!tech) return;

    fetch(`https://cdn.simpleicons.org/${tech.icon}`)
      .then((res) => res.text())
      .then((svg) => setSvgContent(svg))
      .catch(() => setSvgContent(null));
  }, [tech]);

  if (!tech) {
    return showName ? (
      <span className="text-xs font-medium">{name}</span>
    ) : null;
  }

  return (
    <div className="flex items-center gap-1.5">
      {svgContent ? (
        <div
          className={`${className} ${grayscale ? "grayscale brightness-200" : ""}`}
          style={{ color: grayscale ? "currentColor" : tech.color }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div
          className={`${className} rounded bg-muted flex items-center justify-center text-[8px] font-bold`}
        >
          {name.charAt(0)}
        </div>
      )}
      {showName && <span className="text-xs">{name}</span>}
    </div>
  );
}

