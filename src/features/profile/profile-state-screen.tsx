import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

export function ProfileLoadingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <View className="mx-auto w-full max-w-4xl gap-6 px-5 py-8 sm:px-8">
        <View className="flex-row items-center gap-5">
          <Skeleton className="size-24 rounded-full" />
          <View className="flex-1 gap-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-32" />
          </View>
        </View>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-36 w-full" />
      </View>
    </SafeAreaView>
  );
}

export function ProfileMessageScreen({
  action,
  description,
  title,
}: {
  action?: () => void;
  description: string;
  title: string;
}) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <Text variant="h2" className="border-0 text-center">
          {title}
        </Text>
        <Text variant="muted" className="max-w-md text-center leading-5">
          {description}
        </Text>
        {action ? (
          <Button variant="outline" className="mt-2" onPress={action}>
            <Text>Try again</Text>
          </Button>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
