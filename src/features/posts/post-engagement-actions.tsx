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

type PostEngagementActionsProps = {
  postId: string;
  commentsExpanded?: boolean;
  onCommentPress?: () => void;
  onRatingPress?: () => void;
  ratingExpanded?: boolean;
};

export function PostEngagementActions({
  commentsExpanded = false,
  onCommentPress,
  onRatingPress,
  postId,
  ratingExpanded = false,
}: PostEngagementActionsProps) {
  const theme = useTheme();
  const rating = useAskRatingSummary(postId);
  const comments = useCommentCount(postId);
  const averageScore = rating.data?.averageScore ?? null;
  const commentCount = comments.data ?? 0;

  return (
    <View className="flex-1 flex-row items-center gap-3">
      {onRatingPress ? (
        <Button
          accessibilityLabel="Rate this post"
          accessibilityState={{ expanded: ratingExpanded }}
          className={
            ratingExpanded
              ? "h-9 gap-1.5 border border-primary bg-selected px-2"
              : "h-9 gap-1.5 px-2"
          }
          onPress={onRatingPress}
          variant="ghost"
        >
          <Icon
            as={Star}
            className={
              rating.isLoading || rating.isError
                ? "size-4 text-muted-foreground"
                : "size-4 text-rating"
            }
            fill={averageScore === null ? "none" : theme.rating}
          />
          <Text className="text-[13px] font-medium">
            {rating.isLoading || rating.isError
              ? "—"
              : (averageScore?.toFixed(1) ?? "0.0")}
          </Text>
        </Button>
      ) : (
        <View className="flex-row items-center gap-1.5">
          <Icon
            as={Star}
            className={
              rating.isLoading || rating.isError
                ? "size-4 text-muted-foreground"
                : "size-4 text-rating"
            }
            fill={averageScore === null ? "none" : theme.rating}
          />
          <Text className="text-[13px] font-medium">
            {rating.isLoading || rating.isError
              ? "—"
              : (averageScore?.toFixed(1) ?? "0.0")}
          </Text>
        </View>
      )}
      {onCommentPress ? (
        <Button
          accessibilityLabel={
            comments.isError
              ? "Comments unavailable"
              : `View ${commentCount} ${commentCount === 1 ? "comment" : "comments"}`
          }
          accessibilityState={{ expanded: commentsExpanded }}
          className={
            commentsExpanded
              ? "h-9 gap-1.5 border border-primary bg-selected px-2"
              : "h-9 gap-1.5 px-2"
          }
          onPress={onCommentPress}
          variant="ghost"
        >
          <Icon as={MessageCircle} className="size-4 text-muted-foreground" />
          <Text className="text-[13px] font-medium text-muted-foreground">
            {comments.isLoading || comments.isError ? "—" : commentCount}
          </Text>
        </Button>
      ) : (
        <Link href={routes.post(postId)} asChild>
          <Button
            accessibilityLabel={
              comments.isError
                ? "Comments unavailable"
                : `View ${commentCount} ${commentCount === 1 ? "comment" : "comments"}`
            }
            className="gap-1.5"
            size="xs"
            variant="ghost"
          >
            <Icon as={MessageCircle} className="size-4 text-muted-foreground" />
            <Text className="text-[13px] font-medium text-muted-foreground">
              {comments.isLoading || comments.isError ? "—" : commentCount}
            </Text>
          </Button>
        </Link>
      )}
    </View>
  );
}
