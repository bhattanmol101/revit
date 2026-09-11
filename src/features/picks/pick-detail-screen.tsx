import { Link, router, useLocalSearchParams } from "expo-router";
import { Edit3, MapPin, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export function PickDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const pick = usePersonalPick(id);
  const deletePick = useDeletePersonalPick(id, user?.id ?? "");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (pick.isLoading) return <PickLoadingState />;
  const personalPick = pick.data;
  if (pick.isError || !personalPick)
    return <PickMissingState description={pick.error?.message} />;

  const isOwner = personalPick.author_id === user?.id;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView contentContainerClassName="mx-auto w-full max-w-2xl gap-4 px-3 py-4 sm:px-6">
        <View className="gap-2">
          <View className="flex-row items-start justify-between gap-3">
            <Text variant="h1" className="min-w-0 flex-1 text-left text-2xl">
              {personalPick.title}
            </Text>
            {isOwner ? (
              <View className="flex-row gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => router.push(routes.editPick(personalPick.id))}
                >
                  <Icon as={Edit3} />
                  <Text>Edit</Text>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onPress={() => setIsDeleteOpen(true)}
                >
                  <Icon as={Trash2} />
                  <Text>Delete</Text>
                </Button>
              </View>
            ) : null}
          </View>
          {personalPick.description ? (
            <Text variant="muted" className="leading-5">
              {personalPick.description}
            </Text>
          ) : null}
        </View>

        <View className="gap-2">
          {personalPick.items.map((item) => (
            <Link
              key={item.entity_id}
              href={routes.restaurant(item.restaurant.id)}
              asChild
            >
              <Card className="gap-2 py-3 shadow-none">
                <CardContent className="flex-row gap-3">
                  <Text className="w-5 pt-0.5 text-center font-semibold text-primary">
                    {item.position}
                  </Text>
                  <Icon as={MapPin} className="mt-0.5 text-primary" />
                  <View className="min-w-0 flex-1 gap-1">
                    <Text className="font-semibold">
                      {item.restaurant.name}
                    </Text>
                    <Text variant="muted" className="text-xs">
                      {item.restaurant.address_line_1},{" "}
                      {item.restaurant.locality}
                    </Text>
                    {item.note ? (
                      <Text className="text-sm leading-5">{item.note}</Text>
                    ) : null}
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
              This permanently deletes the list. The restaurants themselves are
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

function PickLoadingState() {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center gap-2 bg-background"
      edges={["bottom"]}
    >
      <ActivityIndicator />
      <Text variant="muted">Loading Pick…</Text>
    </SafeAreaView>
  );
}

function PickMissingState({ description }: { description?: string }) {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center gap-2 bg-background px-6"
      edges={["bottom"]}
    >
      <Text variant="h2">Pick unavailable</Text>
      <Text variant="muted" className="text-center">
        {description ?? "This Pick may have been deleted."}
      </Text>
      <Button variant="outline" onPress={() => router.back()}>
        <Text>Go back</Text>
      </Button>
    </SafeAreaView>
  );
}
