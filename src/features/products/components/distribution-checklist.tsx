"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DistributionChannel {
  id: string;
  name: string;
  url?: string;
  category: string;
}

const distributionChannels: DistributionChannel[] = [
  {
    id: "email-waitlist",
    name: "Email waitlist subscribers",
    category: "Email",
  },
  { id: "twitter", name: "Post on X (Twitter)", category: "Social Media" },
  { id: "linkedin", name: "Post on LinkedIn", category: "Social Media" },
  {
    id: "facebook-groups",
    name: "Post on Facebook groups",
    category: "Social Media",
  },
  { id: "email-10x", name: "Email 10x mailing list", category: "Email" },
  {
    id: "email-contacts",
    name: "Email contacts (seed list)",
    category: "Email",
  },
  {
    id: "product-hunt",
    name: "Submit to Product Hunt",
    url: "https://www.producthunt.com/posts/new",
    category: "Directories",
  },
  {
    id: "peerlist",
    name: "Submit to Peerlist",
    url: "https://peerlist.io/submit",
    category: "Directories",
  },
  {
    id: "betalist",
    name: "Submit to Betalist",
    url: "https://betalist.com/submit",
    category: "Directories",
  },
  {
    id: "microlaunch",
    name: "Submit to Microlaunch",
    url: "https://microlaunch.net/submit",
    category: "Directories",
  },
  {
    id: "crunchbase",
    name: "Add to Crunchbase",
    url: "https://www.crunchbase.com/discover/organization/new",
    category: "Directories",
  },
  {
    id: "other-directories",
    name: "Submit to other relevant directories",
    category: "Directories",
  },
  {
    id: "hacker-news",
    name: "Post on Hacker News",
    url: "https://news.ycombinator.com/submit",
    category: "Communities",
  },
  {
    id: "indie-hackers",
    name: "Post on Indie Hackers",
    url: "https://www.indiehackers.com",
    category: "Communities",
  },
  {
    id: "reddit-entrepreneur",
    name: "Post on Reddit r/Entrepreneur",
    url: "https://www.reddit.com/r/Entrepreneur",
    category: "Communities",
  },
  {
    id: "reddit-sideproject",
    name: "Post on Reddit r/SideProject",
    url: "https://www.reddit.com/r/SideProject",
    category: "Communities",
  },
  {
    id: "reddit-entrepreneur-ridealong",
    name: "Post on Reddit r/EntrepreneurRideAlong",
    url: "https://www.reddit.com/r/EntrepreneurRideAlong",
    category: "Communities",
  },
  {
    id: "reddit-startups",
    name: "Post on Reddit r/startups",
    url: "https://www.reddit.com/r/startups",
    category: "Communities",
  },
  {
    id: "reddit-saas",
    name: "Post on Reddit r/SaaS",
    url: "https://www.reddit.com/r/SaaS",
    category: "Communities",
  },
  {
    id: "reddit-internet-is-beautiful",
    name: "Post on Reddit r/InternetIsBeautiful",
    url: "https://www.reddit.com/r/InternetIsBeautiful",
    category: "Communities",
  },
  {
    id: "reddit-roast-my-startup",
    name: "Post on Reddit r/RoastMyStartup",
    url: "https://www.reddit.com/r/RoastMyStartup",
    category: "Communities",
  },
];

export default function DistributionChecklist({
  productId,
}: {
  productId: string;
}) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const categories = Array.from(
    new Set(distributionChannels.map((ch) => ch.category)),
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl leading-tight font-medium">
          Distribution Checklist
        </h2>
        <p className="text-xs text-muted-foreground">
          Check off items as you complete them.
        </p>
      </div>
      <div className="space-y-6">
        {categories.map((category) => {
          const channels = distributionChannels.filter(
            (ch) => ch.category === category,
          );
          return (
            <div key={category}>
              <h3 className="text-sm font-medium mb-3">{category}</h3>
              <div className="space-y-2">
                {channels.map((channel) => {
                  const isChecked = checkedItems.has(channel.id);
                  return (
                    <div
                      key={channel.id}
                      className={`relative flex items-center gap-2.5 rounded transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-muted/50 opacity-60"
                          : "hover:bg-muted/30"
                      }`}
                      onClick={() => toggleItem(channel.id)}
                    >
                      <Checkbox
                        id={channel.id}
                        checked={isChecked}
                        onCheckedChange={() => toggleItem(channel.id)}
                      />
                      <label
                        htmlFor={channel.id}
                        className="flex-1 text-sm cursor-pointer flex items-center gap-1.5"
                      >
                        <span className={isChecked ? "line-through" : ""}>
                          {channel.name}
                        </span>
                      </label>
                      {channel.url && (
                        <Link
                          href={channel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="size-3.5 text-muted-foreground shrink-0" />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
