import * as React from "react";
import { cn } from "@/lib/utils";

const Heading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }
>(({ className, as: Component = "h2", ...props }, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        "text-foreground font-semibold tracking-tight",
        {
          "text-4xl sm:text-5xl md:text-6xl lg:text-7xl": Component === "h1",
          "text-3xl sm:text-4xl": Component === "h2",
          "text-2xl sm:text-3xl": Component === "h3",
          "text-xl sm:text-2xl": Component === "h4",
        },
        className
      )}
      {...props}
    />
  );
});
Heading.displayName = "Heading";

const Text = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base md:text-lg text-muted leading-relaxed", className)}
    {...props}
  />
));
Text.displayName = "Text";

const Lead = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-xl md:text-2xl text-foreground font-medium leading-relaxed tracking-tight",
      className
    )}
    {...props}
  />
));
Lead.displayName = "Lead";

export { Heading, Text, Lead };
