import { Link } from "expo-router";
import {
  ArrowRight,
  Compass,
  MessageCircleQuestion,
  Sparkles,
} from "lucide-react-native";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";

export function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <ScrollView contentContainerClassName="mx-auto w-full max-w-5xl gap-6 px-3 py-4 sm:px-6 sm:py-6">
        <View className="rounded-lg bg-primary px-4 py-5 sm:px-6 sm:py-7">
          <View className="max-w-2xl gap-3">
            <View className="self-start flex-row items-center gap-1.5 rounded-md bg-white/15 px-2 py-1">
              <Icon as={Sparkles} className="size-4 text-white" />
              <Text className="text-sm font-semibold text-white">
                Your people. Their taste.
              </Text>
            </View>
            <Text
              variant="h1"
              className="max-w-xl text-left text-2xl leading-8 text-white sm:text-4xl sm:leading-[46px]"
            >
              Good taste is better shared.
            </Text>
            <Text className="max-w-xl text-sm leading-5 text-white/85 sm:text-base">
              Ask the people you trust, trade honest ratings, and keep every
              recommendation worth remembering.
            </Text>
            <View className="flex-row flex-wrap gap-2 pt-1">
              <Link href={routes.createAsk} asChild>
                <Button className="bg-white shadow-none" size="lg">
                  <Icon as={MessageCircleQuestion} className="text-primary" />
                  <Text className="text-primary">Ask something</Text>
                </Button>
              </Link>
              <Link href={routes.discover} asChild>
                <Button
                  className="border-white/30 bg-white/10"
                  size="lg"
                  variant="outline"
                >
                  <Icon as={Compass} className="text-white" />
                  <Text className="text-white">Find people</Text>
                </Button>
              </Link>
            </View>
          </View>
        </View>

        <View className="gap-3">
          <View className="gap-1">
            <Text variant="h3">Your feed</Text>
            <Text variant="muted" className="text-base">
              Fresh questions and recommendations from people you follow.
            </Text>
          </View>
          <View className="items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-none sm:flex-row sm:items-center">
            <View className="size-10 items-center justify-center rounded-md bg-accent">
              <Icon as={Sparkles} className="size-5 text-accent-foreground" />
            </View>
            <View className="min-w-0 flex-1 gap-1.5">
              <Text className="text-base font-bold">
                Build a feed that feels like you.
              </Text>
              <Text variant="muted" className="max-w-xl text-sm leading-5">
                Follow a few people and their Ask posts and restaurant ratings
                will land here—no noise, just trusted taste.
              </Text>
            </View>
            <Link href={routes.discover} asChild>
              <Button variant="secondary">
                <Text>Discover people</Text>
                <Icon as={ArrowRight} />
              </Button>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
