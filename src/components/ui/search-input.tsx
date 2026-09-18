import { Search } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchInputProps = React.ComponentProps<typeof Input>;

function SearchInput({ className, ...props }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={cn(
        "min-h-11 flex-row items-center gap-2 rounded-lg border bg-card px-3",
        isFocused ? "border-primary" : "border-input",
      )}
    >
      <Icon as={Search} className="size-4 shrink-0 text-muted-foreground" />
      <Input
        {...props}
        accessibilityRole="search"
        appearance="embedded"
        className={cn("flex-1", className)}
        onBlur={(event) => {
          setIsFocused(false);
          props.onBlur?.(event);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          props.onFocus?.(event);
        }}
        returnKeyType={props.returnKeyType ?? "search"}
      />
    </View>
  );
}

export { SearchInput };
