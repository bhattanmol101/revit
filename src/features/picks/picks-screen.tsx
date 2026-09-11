import { Link } from "expo-router";
import { Plus } from "lucide-react-native";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackState } from "@/components/ui/feedback-state";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { usePersonalPicksByAuthor } from "@/queries/picks";

export function PicksScreen() {
  const { profile } = useAuth();
  const picks = usePersonalPicksByAuthor(profile?.id ?? "");
  const items = picks.data ?? [];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <ScrollView contentContainerClassName="mx-auto w-full max-w-3xl gap-4 px-3 py-4 sm:px-6">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-1">
            <Text variant="h1" className="text-left text-2xl">
              Your Picks
            </Text>
            <Text variant="muted">
              Ordered restaurant lists you can share publicly.
            </Text>
          </View>
          <Link href={routes.createPick} asChild>
            <Button size="sm">
              <Icon as={Plus} />
              <Text>New</Text>
            </Button>
          </Link>
        </View>

        {picks.isLoading ? (
          <View className="items-center gap-2 py-10">
            <ActivityIndicator />
            <Text variant="muted">Loading Picks…</Text>
          </View>
        ) : null}
        {picks.isError ? (
          <FeedbackState
            actionLabel="Retry"
            onAction={() => void picks.refetch()}
            title="Couldn’t load Picks."
            variant="error"
          />
        ) : null}
        {!picks.isLoading && !picks.isError && items.length === 0 ? (
          <FeedbackState
            description="Create your first ordered restaurant list."
            title="No Picks yet"
          />
        ) : null}
        {items.map((pick) => (
          <Link key={pick.id} href={routes.pick(pick.id)} asChild>
            <Card className="gap-1 py-3 shadow-none">
              <CardHeader>
                <CardTitle>{pick.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text variant="muted">
                  {pick.description?.trim() || "Restaurant collection"}
                </Text>
              </CardContent>
            </Card>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
