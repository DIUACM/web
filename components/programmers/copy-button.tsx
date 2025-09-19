"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  platform: string;
  className?: string;
}

export function CopyButton({ text, platform, className }: CopyButtonProps) {
  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${platform} handle copied`, { description: text });
      })
      .catch(() => {
        toast.error(`Failed to copy ${platform} handle`);
      });
  };

  return (
    <button
      onClick={() => copyToClipboard(text, platform)}
      className={className || "text-current hover:opacity-70 transition-opacity"}
      aria-label={`Copy ${platform}`}
      type="button"
    >
      <Copy className="w-3 h-3" />
    </button>
  );
}
