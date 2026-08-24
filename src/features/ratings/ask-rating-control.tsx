import { Star } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/providers/auth-provider";
import { useMyAskRating, useSetMyAskRating } from "@/queries/ratings";

const SCORES = [1, 2, 3, 4, 5] as const;

export function AskRatingControl({ postId }: { postId: string }) {
  const { user } = useAuth();
  const raterId = user?.id ?? "";
  const rating = useMyAskRating(postId, raterId);
  const setRating = useSetMyAskRating(postId, raterId);
  const currentScore = rating.data?.score ?? null;

  if (!user) return null;

  return (
    <View className="gap-3 border-t border-border pt-4">
      <View className="flex-row flex-wrap items-center justify-between gap-2">
        <Text className="font-medium">
          {currentScore === null
            ? "Rate this Ask"
            : `Your rating: ${currentScore.toFixed(1)}`}
        </Text>
        {currentScore !== null ? (
          <Button
            accessibilityLabel="Remove your rating"
            disabled={setRating.isPending}
            onPress={() => setRating.mutate(null)}
            size="sm"
            variant="ghost"
          >
            <Text>Remove</Text>
          </Button>
        ) : null}
      </View>

      <View className="flex-row gap-2">
        {SCORES.map((score) => {
          const isSelected = currentScore === score;

          return (
            <Button
              key={score}
              accessibilityLabel={`Rate ${score} out of 5`}
              accessibilityState={{ selected: isSelected }}
              disabled={rating.isLoading || setRating.isPending}
              onPress={() => setRating.mutate(score)}
              size="icon"
              variant={isSelected ? "default" : "outline"}
            >
              <Icon as={Star} className="size-4" />
            </Button>
          );
        })}
      </View>

      {rating.isError ? (
        <View className="flex-row flex-wrap items-center gap-2">
          <Text variant="muted">Your rating could not be loaded.</Text>
          <Button
            onPress={() => void rating.refetch()}
            size="sm"
            variant="link"
          >
            <Text>Try again</Text>
          </Button>
        </View>
      ) : null}

      {setRating.error ? (
        <Text className="text-destructive" variant="small">
          {setRating.error.message}
        </Text>
      ) : null}
    </View>
  );
}
