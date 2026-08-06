import * as React from "react";
import { cn } from "@/lib/utils";

const Section = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn(
      // scroll-mt keeps section tops clear of the fixed header on anchor jumps.
      "relative flex w-full flex-col py-28 md:py-40 scroll-mt-20 md:scroll-mt-24",
      className
    )}
    {...props}
  />
));
Section.displayName = "Section";

export { Section };
