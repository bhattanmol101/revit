import { Platform, TextInput } from "react-native";
import { cn } from "@/lib/utils";

function Input({
  className,
  placeholderTextColorClassName,
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        "border-input bg-card text-foreground focus:border-primary flex h-11 w-full min-w-0 flex-row items-center rounded-lg border px-3 py-2 text-[15px] leading-5",
        props.editable === false &&
          cn(
            "opacity-50",
            Platform.select({
              web: "disabled:pointer-events-none disabled:cursor-not-allowed",
            }),
          ),
        Platform.select({
          web: cn(
            "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm",
            "focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[2px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          ),
          native: "placeholder:text-muted-foreground",
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Input };
