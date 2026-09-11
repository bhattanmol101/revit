import { cva, type VariantProps } from "class-variance-authority";
import { Platform, Pressable } from "react-native";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "group shrink-0 flex-row items-center justify-center gap-2 rounded-md active:opacity-90",
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    }),
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-primary active:bg-primary/80",
          Platform.select({ web: "hover:bg-primary/90" }),
        ),
        destructive: cn(
          "bg-destructive active:bg-destructive/90",
          Platform.select({
            web: "hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
          }),
        ),
        outline: cn(
          "border-primary bg-transparent active:bg-selected border",
          Platform.select({
            web: "hover:bg-selected",
          }),
        ),
        secondary: cn(
          "bg-elevated active:bg-selected",
          Platform.select({ web: "hover:bg-selected" }),
        ),
        ghost: cn(
          "active:bg-selected",
          Platform.select({ web: "hover:bg-selected" }),
        ),
        link: "",
      },
      size: {
        default: cn(
          "h-11 px-4 py-2.5",
          Platform.select({ web: "has-[>svg]:px-4" }),
        ),
        sm: cn(
          "h-11 gap-1.5 rounded-md px-3",
          Platform.select({ web: "h-9 has-[>svg]:px-2.5" }),
        ),
        lg: cn(
          "h-12 rounded-lg px-5",
          Platform.select({ web: "has-[>svg]:px-5" }),
        ),
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva(
  cn(
    "text-foreground text-sm font-medium",
    Platform.select({ web: "pointer-events-none transition-colors" }),
  ),
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        destructive: "text-white",
        outline: "text-primary",
        secondary: "text-foreground",
        ghost: "text-primary",
        link: cn(
          "text-primary group-active:underline",
          Platform.select({
            web: "underline-offset-4 hover:underline group-hover:underline",
          }),
        ),
      },
      size: {
        default: "",
        sm: "",
        lg: "",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  const resolvedVariant = variant ?? "default";
  const disabledClass =
    resolvedVariant === "default"
      ? "border-transparent bg-selected"
      : resolvedVariant === "destructive"
        ? "bg-destructive/60"
        : "opacity-50";

  return (
    <TextClassContext.Provider
      value={cn(
        buttonTextVariants({ variant: resolvedVariant, size }),
        props.disabled && "text-disabled",
      )}
    >
      <Pressable
        className={cn(
          buttonVariants({ variant: resolvedVariant, size }),
          props.disabled && disabledClass,
          className,
        )}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export type { ButtonProps };
export { Button, buttonTextVariants, buttonVariants };
