import { SafeAreaView } from "@/components/ui/safe-area-view";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type RoutePlaceholderScreenProps = {
  description: string;
  title: string;
};

export function RoutePlaceholderScreen({ description, title }: RoutePlaceholderScreenProps) {
  return (
    <ThemedView className="flex-1 flex-row justify-center">
      <SafeAreaView className="flex-1 w-full max-w-4xl gap-6 px-6 py-16">
        <ThemedText type="title">{title}</ThemedText>
        <ThemedView type="backgroundElement" className="rounded-lg p-6">
          <ThemedText themeColor="textSecondary">{description}</ThemedText>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}
