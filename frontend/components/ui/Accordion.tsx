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
    <div className={cn("border-b border-[var(--am-line)]/80 dark:border-white/5 last:border-0", className)}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 px-2 text-left transition-all duration-300 hover:bg-[var(--am-field)]/50 dark:hover:bg-white/[0.03] rounded-xl group"
      >
        <div className="flex-1 min-w-0">{title}</div>
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ml-3 shrink-0",
          isOpen
            ? "bg-[var(--am-ink)] border-[var(--am-ink)] rotate-180"
            : "border-[var(--am-line)] dark:border-white/15 group-hover:border-[var(--am-primary)] dark:group-hover:border-white/30"
        )}>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-colors duration-300",
              isOpen
                ? "text-[var(--am-surface)]"
                : "text-[var(--am-muted)] group-hover:text-[var(--am-ink)]"
            )}
          />
        </div>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]",
          isOpen ? "max-h-[2000px] opacity-100 mb-4" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-3 text-sm text-[var(--am-ink)] dark:text-[var(--am-muted)] space-y-3 leading-relaxed">
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
    <div className={cn("w-full divide-y divide-[var(--am-line)]/80 dark:divide-white/5", className)}>
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
