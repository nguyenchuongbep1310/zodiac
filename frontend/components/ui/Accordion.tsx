import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: React.ReactNode;
  content: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function AccordionItem({ title, content, isOpen = false, onToggle, className }: AccordionItemProps) {
  return (
    <div className={cn("border-b border-black/5 dark:border-white/5 last:border-0", className)}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 px-2 text-left transition-all hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
      >
        <div className="flex-1 min-w-0">{title}</div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[1000px] opacity-100 mb-4" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 space-y-3">
          {content}
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: {
    id: string;
    title: React.ReactNode;
    content: React.ReactNode;
  }[];
  className?: string;
  allowMultiple?: boolean;
}

export function Accordion({ items, className, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setOpenItems((prev) => {
      const newOpenItems = new Set(prev);
      if (newOpenItems.has(id)) {
        newOpenItems.delete(id);
      } else {
        if (!allowMultiple) {
          newOpenItems.clear();
        }
        newOpenItems.add(id);
      }
      return newOpenItems;
    });
  };

  return (
    <div className={cn("w-full divide-y divide-black/5 dark:divide-white/5", className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          title={item.title}
          content={item.content}
          isOpen={openItems.has(item.id)}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </div>
  );
}
