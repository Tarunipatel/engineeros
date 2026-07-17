import { cn } from "@/lib/utils";

export function LogoMark({ className, textClassName }: { className?: string; textClassName?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent-purple text-primary-foreground shadow-sm",
        className
      )}
    >
      <span className={cn("font-semibold leading-none", textClassName)}>E</span>
    </div>
  );
}
