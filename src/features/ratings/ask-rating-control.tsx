import { Star, X } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { selectionFeedback } from "@/lib/feedback";
import { useAuth } from "@/providers/auth-provider";
import { useMyAskRating, useSetMyAskRating } from "@/queries/ratings";

const SCORES = [1, 2, 3, 4, 5] as const;

export function AskRatingControl({ postId }: { postId: string }) {
  const { user } = useAuth();
  const theme = useTheme();
  const raterId = user?.id ?? "";
  const rating = useMyAskRating(postId, raterId);
  const setRating = useSetMyAskRating(postId, raterId);
  const currentScore = rating.data?.score ?? null;

  if (!user) return null;

  if (rating.error) {
    return (
      <View className="flex-1 flex-row flex-wrap items-center justify-end gap-2">
        <Text className="text-xs" variant="muted">
          Your rating could not be loaded.
        </Text>
        <Button
          onPress={() => void rating.refetch()}
          className="h-7 px-1.5"
          variant="link"
        >
          <Text className="text-xs">Try again</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="min-w-0 flex-1 items-end justify-center gap-0.5">
      <View className="flex-row items-center gap-0.5">
        {SCORES.map((score) => {
          const isSelected = currentScore === score;
          const isActive = currentScore !== null && score <= currentScore;

          return (
            <Button
              key={score}
              accessibilityLabel={`Rate ${score} out of 5`}
              accessibilityState={{ selected: isSelected }}
              disabled={rating.isLoading || setRating.isPending}
              hitSlop={8}
              onPress={() => {
                selectionFeedback();
                setRating.mutate(score);
              }}
              className="size-6 px-0"
              variant="ghost"
            >
              <Icon
                as={Star}
                className={
                  isActive
                    ? "size-[18px] text-rating"
                    : "size-[18px] text-muted-foreground/60"
                }
                fill={isActive ? theme.rating : "none"}
                strokeWidth={isActive ? 2.3 : 1.8}
              />
            </Button>
          );
        })}
        {currentScore !== null ? (
          <Button
            accessibilityLabel="Remove your rating"
            disabled={setRating.isPending}
            hitSlop={8}
            onPress={() => setRating.mutate(null)}
            className="ml-1 size-6 p-0"
            variant="ghost"
          >
            <Icon as={X} className="size-4 text-muted-foreground" />
          </Button>
        ) : null}
      </View>

      <Text className="text-[11px]" variant="muted">
        Your rating
      </Text>

      {setRating.error ? (
        <Text className="text-xs text-destructive">
          {setRating.error.message}
        </Text>
      ) : null}
    </View>
  );
}
