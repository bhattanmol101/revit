import { Link } from "expo-router";
import { MapPin, MessageCircle } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

import type { Entity } from "@/api/entities";
import type { SharePostWithDetails } from "@/api/shares";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { InlineCommentDrawer } from "@/features/comments/inline-comment-drawer";
import { routes } from "@/lib/routes";
import { Colors } from "@/constants/theme";
import { useCommentCount } from "@/queries/comments";
import { StarRating } from "@/features/ratings/star-rating";

import { PostMediaGallery } from "./post-media-gallery";

type SharePostCardProps = {
  isDetail?: boolean;
  post: SharePostWithDetails;
  entity: Entity;
};

export function SharePostCard({
  isDetail = false,
  post,
  entity,
}: SharePostCardProps) {
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const comments = useCommentCount(post.id);
  const commentCount = comments.data ?? 0;

  return (
    <Card className="mx-auto w-full max-w-[36rem] self-center gap-0 overflow-hidden rounded-none border-x-0 pb-0 pt-0 md:rounded-lg md:border">
      <CardHeader className="md:pt-3 py-2">
        <View className="flex-row items-start justify-between gap-2">
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
          <Badge className="rounded-full px-2 py-0.5" variant="default">
            <Text className="text-[9px] font-semibold">SHARE</Text>
          </Badge>
        </View>
      </CardHeader>
      <CardContent className="gap-2 px-0">
        <Link
          href={{
            pathname: routes.createShare,
            params: { entityId: entity.id },
          }}
          asChild
          className="px-2 md:px-3 md:pt-1 py-0"
        >
          <View
            className="flex flex-row gap-2 items-center"
            accessibilityLabel={`View ${entity.name}`}
          >
            <Icon
              as={MapPin}
              className="size-5"
              color={Colors.light.primary}
            />
            <View className="flex-1 items-start gap-0.5">
              <Text className="text-[14px] font-semibold" numberOfLines={1}>
                {entity.name}
              </Text>
              <Text
                className="text-xs text-muted-foreground"
                variant="muted"
                numberOfLines={1}
              >
                {[entity.category.label, entity.locality]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
            </View>
            <StarRating
              value={post.ratingScore}
              readOnly
              allowHalf
              animated={false}
              starSize={16}
              gap={5}
            />
          </View>
        </Link>

        <View className="px-2">
          {post.body ? (
            <Text className="text-sm leading-5" variant="muted">
              {post.body}
            </Text>
          ) : null}
        </View>
        <PostMediaGallery isDetail={isDetail} media={post.media} />
      </CardContent>

      <CardFooter className="flex-col items-start w-full px-0">
        <View className="w-full flex-row items-center justify-start px-2.5 py-2">
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
                className={`h-8 gap-1.5 border ${commentsExpanded ? "border-primary bg-selected" : "border-transparent"}`}
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
      </CardFooter>
    </Card>
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
