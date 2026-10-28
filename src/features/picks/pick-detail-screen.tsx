import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { Edit3, MapPin, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { AppHeader } from "@/components/navigation/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";
import { useAuth } from "@/providers/auth-provider";
import { useDeletePersonalPick, usePersonalPick } from "@/queries/picks";
import { Separator } from "@/components/ui/separator";

export function PickDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const pick = usePersonalPick(id);
  const deletePick = useDeletePersonalPick(id, user?.id ?? "");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.picks);
  };

  if (pick.isLoading) return <PickLoadingState onBack={goBack} />;
  const personalPick = pick.data;
  if (pick.isError || !personalPick)
    return (
      <PickMissingState description={pick.error?.message} onBack={goBack} />
    );

  const isOwner = personalPick.author_id === user?.id;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader showAccountActions title="Picks" onBack={goBack} />
          ),
        }}
      />
      <ScrollView contentContainerClassName="w-full gap-2 px-2 py-3 md:mx-auto md:max-w-2xl md:px-6 md:py-6">
        <View className="gap-2 border border-muted rounded-md px-4 py-2 bg-muted mb-2">
          <View className="flex-row items-start justify-between gap-3">
            <View>
              <Text variant="h2" className="text-xl">
                {personalPick.title}
              </Text>
              {personalPick.description ? (
                <Text variant="muted" className="leading-5">
                  {personalPick.description}
                </Text>
              ) : null}
            </View>
            {isOwner ? (
              <View className="flex-row gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  hitSlop={8}
                  onPress={() => router.push(routes.editPick(personalPick.id))}
                >
                  <Icon as={Edit3} className="size-4" />
                </Button>
                <Button
                  size="xs"
                  variant="destructive"
                  className="py-1 px-2"
                  onPress={() => setIsDeleteOpen(true)}
                  hitSlop={8}
                >
                  <Icon as={Trash2} className="size-4" />
                </Button>
              </View>
            ) : null}
          </View>
        </View>

        <View className="gap-2">
          {personalPick.items.map((item) => (
            <Link
              key={item.entity_id}
              href={{ pathname: routes.createShare, params: { entityId: item.entity.id } }}
              asChild
            >
              <Card className="gap-2 py-3 shadow-none">
                <CardContent className="flex-row items-center gap-4">
                  <View key={item.position} className="items-center">
                    <View className="size-5 items-center justify-center rounded-full border-2 border-primary-foreground/40 bg-background/10">
                      <Text className="text-[11px] font-semibold leading-none text-primary-foreground">
                        {item.position}
                      </Text>
                    </View>
                    {/*{position < 3 ? (
                      <View className="h-2 w-0.5 bg-primary-foreground/40" />
                    ) : null}*/}
                  </View>
                  <View className="flex flex-row gap-2">
                    <View className="mt-0.5">
                      <Icon as={MapPin} />
                    </View>
                    <View className="gap-1">
                      <Text className="font-semibold">
                        {item.entity.name}
                      </Text>
                      <Text variant="muted" className="text-xs">
                        {[item.entity.category.label, item.entity.locality].filter(Boolean).join(" · ")}
                      </Text>
                      {item.note ? (
                        <Text className="text-sm leading-5">{item.note}</Text>
                      ) : null}
                    </View>
                  </View>
                </CardContent>
              </Card>
            </Link>
          ))}
        </View>
      </ScrollView>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this Pick?</DialogTitle>
            <DialogDescription>
              This permanently deletes the list. The finds themselves are
              not affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onPress={() => setIsDeleteOpen(false)}>
              <Text>Cancel</Text>
            </Button>
            <Button
              disabled={deletePick.isPending}
              variant="destructive"
              onPress={() =>
                void deletePick
                  .mutateAsync()
                  .then(() => router.replace(routes.picks))
                  .catch(() => {})
              }
            >
              <Text>{deletePick.isPending ? "Deleting…" : "Delete Pick"}</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SafeAreaView>
  );
}

function PickLoadingState({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader showAccountActions title="Picks" onBack={onBack} />
          ),
        }}
      />
      <View className="px-6 py-6 md:mx-auto md:w-full md:max-w-2xl">
        <ContentSkeleton rows={3} />
      </View>
    </SafeAreaView>
  );
}

function PickMissingState({
  description,
  onBack,
}: {
  description?: string;
  onBack: () => void;
}) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen
        options={{
          header: () => (
            <AppHeader showAccountActions title="Picks" onBack={onBack} />
          ),
        }}
      />
      <View className="flex-1 items-center justify-center gap-2 px-6">
        <Text variant="h2">Pick unavailable</Text>
        <Text variant="muted" className="text-center">
          {description ?? "This Pick may have been deleted."}
        </Text>
        <Button variant="outline" onPress={onBack}>
          <Text>Go back</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
