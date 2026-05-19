import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;

type SheetContentProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
  overlayClassName?: string;
};

export function SheetContent({ className, children, overlayClassName, ...props }: SheetContentProps) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className={cn("fixed inset-0 z-40 bg-black/25", overlayClassName)} />
      <SheetPrimitive.Content className={cn("fixed right-0 top-0 z-50 h-full w-full max-w-md border-l bg-background p-5 shadow-lg", className)} {...props}>
        {children}
        <SheetPrimitive.Close className="absolute right-3 top-3 text-muted-foreground"><X className="h-4 w-4" /></SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

export function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold", className)} {...props} />;
}
