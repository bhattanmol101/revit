import { Link } from "expo-router";
import { MessageCircle, Star } from "lucide-react-native";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { routes } from "@/lib/routes";
import { useCommentCount } from "@/queries/comments";
import { useAskRatingSummary } from "@/queries/ratings";

export function PostEngagementActions({ postId }: { postId: string }) {
  const theme = useTheme();
  const rating = useAskRatingSummary(postId);
  const comments = useCommentCount(postId);
  const averageScore = rating.data?.averageScore ?? null;
  const commentCount = comments.data ?? 0;

  return (
    <View className="flex-1 flex-row items-center gap-4">
      <View className="flex flex-row gap-2">
        <Icon
          as={Star}
          className={
            rating.isLoading || rating.isError
              ? "size-5 text-muted-foreground"
              : "size-5 text-rating"
          }
          fill={averageScore === null ? "none" : theme.rating}
        />
        <Text className="text-md font-semibold">
          {rating.isLoading || rating.isError
            ? "—"
            : (averageScore?.toFixed(1) ?? "0.0")}
        </Text>
      </View>
      <Link href={routes.post(postId)} asChild>
        <Button
          accessibilityLabel={
            comments.isError
              ? "Comments unavailable"
              : `View ${commentCount} ${commentCount === 1 ? "comment" : "comments"}`
          }
          className="rounded-full py-0 px-2"
          variant="ghost"
        >
          <Icon as={MessageCircle} className="size-5 text-foreground" />
          <Text className="text-md font-semibold">
            {comments.isLoading || comments.isError ? "—" : commentCount}
          </Text>
        </Button>
      </Link>
    </View>
  );
}
