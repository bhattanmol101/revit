import { SafeAreaView } from "@/components/ui/safe-area-view";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export function HomeScreen() {
  return (
    <ThemedView className="flex-1 flex-row justify-center">
      <SafeAreaView className="flex-1 w-full max-w-4xl gap-6 px-6 py-16">
        <ThemedView className="gap-2 pt-6">
          <ThemedText type="title">Your ratings, shared.</ThemedText>
          <ThemedText className="max-w-md leading-6" themeColor="textSecondary">
            Follow people to see what they are asking about and what they recommend.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" className="gap-2 rounded-lg px-4 py-6">
          <ThemedText type="subtitle">Your feed will appear here.</ThemedText>
          <ThemedText themeColor="textSecondary">
            Once you follow people, their Ask posts and restaurant ratings will show up here.
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}
