import { Image } from "expo-image";
import { Link } from "expo-router";
import { View } from "react-native";

import type { PostWithDetails } from "@/api/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { AskRatingControl } from "@/features/ratings/ask-rating-control";
import { routes } from "@/lib/routes";

import { PostEngagementActions } from "./post-engagement-actions";

type AskPostCardProps = {
  isDetail?: boolean;
  post: PostWithDetails;
};

export function AskPostCard({ isDetail = false, post }: AskPostCardProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-lg pb-0 pt-0.5 shadow-none">
      <CardHeader className="gap-2 px-3 pt-2">
        <View className="flex-row items-start justify-between gap-3">
          <Link href={routes.user(post.author.username)} asChild>
            <Button
              variant="ghost"
              className="h-auto min-w-0 flex-1 justify-start gap-2 px-0 py-0"
            >
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
                <Text className="text-sm font-semibold" numberOfLines={1}>
                  {post.author.display_name}
                </Text>
                <Text className="text-xs" variant="muted" numberOfLines={1}>
                  @{post.author.username} · {formatPostDate(post.created_at)}
                </Text>
              </View>
            </Button>
          </Link>
          <Badge
            className="rounded-md border-primary/35 bg-transparent px-1.5 py-0.5"
            variant="outline"
          >
            <Text className="text-[0.6rem] font-semibold text-primary">
              ASK
            </Text>
          </Badge>
        </View>

        <CardTitle className="text-md">{post.title}</CardTitle>
      </CardHeader>

      <CardContent className="gap-1 px-0 pt-1">
        {post.body ? (
          <Text className="px-3 text-[0.8rem] text-muted-foreground">
            {post.body}
          </Text>
        ) : null}

        {post.media.length > 0 ? (
          <View>
            {post.media.map((media, index) => (
              <Image
                key={media.id}
                accessibilityLabel={
                  media.alt_text ||
                  `Post image ${index + 1} of ${post.media.length}`
                }
                className="aspect-square w-full bg-muted"
                contentFit="cover"
                recyclingKey={media.id}
                source={{ uri: media.signedUrl }}
                transition={150}
                style={{
                  width: "100%",
                  aspectRatio: 1,
                }}
              />
            ))}
          </View>
        ) : null}
        <View className="flex-row px-3 -mt-1">
          <PostEngagementActions postId={post.id} />
          <Separator className="h-11" orientation="vertical" />
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
