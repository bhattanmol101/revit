import { Link } from "expo-router";
import { MapPin, MessageCircle, Star, StarHalf } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import type { Restaurant } from "@/api/restaurants";
import type { SharePostWithDetails } from "@/api/shares";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { InlineCommentDrawer } from "@/features/comments/inline-comment-drawer";
import { useTheme } from "@/hooks/use-theme";
import { routes } from "@/lib/routes";
import { useCommentCount } from "@/queries/comments";

import { PostMediaGallery } from "./post-media-gallery";

type SharePostCardProps = {
  isDetail?: boolean;
  post: SharePostWithDetails;
  restaurant: Restaurant;
};

export function SharePostCard({
  isDetail = false,
  post,
  restaurant,
}: SharePostCardProps) {
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const comments = useCommentCount(post.id);
  const commentCount = comments.data ?? 0;

  return (
    <Card className="gap-0 overflow-hidden rounded-none border-x-0 pb-0 pt-0 md:rounded-lg md:border">
      <CardHeader className="gap-4 px-5 pb-4 pt-5">
        <View className="flex-row items-start justify-between gap-3">
          <Avatar
            alt={`${post.author.display_name}'s avatar`}
            className="size-9"
          >
            {post.author.avatar_url ? (
              <AvatarImage
                accessibilityLabel={`${post.author.display_name}'s avatar`}
                source={{ uri: post.author.avatar_url }}
              />
            ) : null}
            <AvatarFallback>
              <Text variant="small">
                {getInitials(post.author.display_name)}
              </Text>
            </AvatarFallback>
          </Avatar>
          <View className="min-w-0 flex-1 items-start">
            <Link
              href={routes.user(post.author.username)}
              className="pointer-cursor"
            >
              <Text className="text-sm font-semibold" numberOfLines={1}>
                {post.author.display_name}
              </Text>
            </Link>
            <Link
              href={routes.user(post.author.username)}
              className="pointer-cursor"
            >
              <Text className="text-xs" variant="muted" numberOfLines={1}>
                @{post.author.username} · {formatPostDate(post.created_at)}
              </Text>
            </Link>
          </View>
          <Badge className="rounded-full px-2.5 py-1" variant="default">
            <Text className="text-[11px] font-semibold">SHARE</Text>
          </Badge>
        </View>

        <Link href={routes.restaurant(restaurant.id)} asChild>
          <Button
            accessibilityLabel={`View ${restaurant.name}`}
            className="w-full border-l-2 border-primary"
            size="content"
            variant="ghost"
          >
            <Icon as={MapPin} className="size-5 text-primary" />
            <View className="min-w-0 flex-1 items-start gap-0.5">
              <Text
                className="text-lg font-semibold leading-6"
                numberOfLines={1}
              >
                {restaurant.name}
              </Text>
              <Text className="text-xs" variant="muted" numberOfLines={1}>
                {restaurant.locality}
              </Text>
            </View>
            <ShareRating score={post.ratingScore} />
          </Button>
        </Link>

        {post.body ? (
          <Text className="text-sm leading-5" variant="muted">
            {post.body}
          </Text>
        ) : null}
      </CardHeader>

      <CardContent className="gap-0 px-0">
        <PostMediaGallery isDetail={isDetail} media={post.media} />
        <Separator />
        <View className="min-h-14 flex-row items-center px-5 py-2">
          <View className="flex-1 flex-row items-center gap-3">
            {isDetail ? (
              <Link href={routes.post(post.id)} asChild>
                <Button
                  accessibilityLabel={`View ${commentCount} ${commentCount === 1 ? "comment" : "comments"}`}
                  className="gap-1.5"
                  size="xs"
                  variant="ghost"
                >
                  <Icon
                    as={MessageCircle}
                    className="size-4 text-muted-foreground"
                  />
                  <Text className="text-[13px] font-medium text-muted-foreground">
                    {comments.isLoading || comments.isError
                      ? "—"
                      : commentCount}
                  </Text>
                </Button>
              </Link>
            ) : (
              <Button
                accessibilityLabel={`View ${commentCount} ${commentCount === 1 ? "comment" : "comments"}`}
                accessibilityState={{ expanded: commentsExpanded }}
                className={
                  commentsExpanded
                    ? "h-9 gap-1.5 border border-primary bg-selected px-2"
                    : "h-9 gap-1.5 px-2"
                }
                variant="ghost"
                onPress={() => setCommentsExpanded((expanded) => !expanded)}
              >
                <Icon
                  as={MessageCircle}
                  className="size-4 text-muted-foreground"
                />
                <Text className="text-[13px] font-medium text-muted-foreground">
                  {comments.isLoading || comments.isError ? "—" : commentCount}
                </Text>
              </Button>
            )}
          </View>
        </View>
        {!isDetail && commentsExpanded ? (
          <InlineCommentDrawer postId={post.id} />
        ) : null}
      </CardContent>
    </Card>
  );
}

function ShareRating({ score }: { score: number }) {
  const theme = useTheme();
  const safeScore = Math.max(0, Math.min(score, 5));

  return (
    <View className="flex-row shrink-0 items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = safeScore >= star;
        const isHalfFilled = !isFilled && safeScore >= star - 0.5;

        return (
          <Icon
            key={star}
            as={isHalfFilled ? StarHalf : Star}
            className={
              isFilled || isHalfFilled
                ? "size-3.5 text-rating"
                : "size-3.5 text-muted-foreground/60"
            }
            fill={isFilled || isHalfFilled ? theme.rating : "none"}
            strokeWidth={isFilled ? 2.2 : 1.8}
          />
        );
      })}
      <Text className="ml-1 text-[13px] font-medium">{score.toFixed(1)}</Text>
    </View>
  );
}

function formatPostDate(createdAt: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(createdAt));
}

function getInitials(displayName: string) {
  return displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
