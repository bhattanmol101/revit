import { Link } from "expo-router";
import { View } from "react-native";

import type { PostWithDetails } from "@/api/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { AskRatingControl } from "@/features/ratings/ask-rating-control";
import { routes } from "@/lib/routes";

import { PostEngagementActions } from "./post-engagement-actions";
import { PostMediaGallery } from "./post-media-gallery";

type AskPostCardProps = {
  isDetail?: boolean;
  post: PostWithDetails;
};

export function AskPostCard({ isDetail = false, post }: AskPostCardProps) {
  return (
    <Card className="gap-0 overflow-hidden pb-0 pt-0">
      <CardHeader className="gap-3 px-3 pb-3 pt-3">
        <View className="flex-row items-start justify-between gap-3">
          <Avatar
            alt={`${post.author.display_name}'s avatar`}
            className="size-8"
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

          <Badge className="px-2 py-0.5" variant="outline">
            <Text className="text-[11px] font-medium">ASK</Text>
          </Badge>
        </View>

        <CardTitle className="text-lg leading-6">{post.title}</CardTitle>
        {post.body ? (
          <Text className="text-[13px] leading-5" variant="muted">
            {post.body}
          </Text>
        ) : null}
      </CardHeader>

      <CardContent className="gap-0 px-0">
        <PostMediaGallery isDetail={isDetail} media={post.media} />
        <Separator />
        <View className="min-h-14 flex-row items-stretch px-3 py-2">
          <PostEngagementActions postId={post.id} />
          <Separator className="mx-3 h-10 self-center" orientation="vertical" />
          <AskRatingControl postId={post.id} />
        </View>
      </CardContent>
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
