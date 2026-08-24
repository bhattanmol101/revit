import { Image } from "expo-image";
import { Link } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";

import type { PostWithDetails } from "@/api/posts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";

type AskPostCardProps = {
  actions?: ReactNode;
  isDetail?: boolean;
  post: PostWithDetails;
};

export function AskPostCard({
  actions,
  isDetail = false,
  post,
}: AskPostCardProps) {
  return (
    <Card className="gap-4 py-5">
      <CardHeader className="gap-4">
        <View className="flex-row items-start justify-between gap-4">
          <Link href={routes.user(post.author.username)} asChild>
            <Button
              variant="ghost"
              className="h-auto min-w-0 flex-1 justify-start gap-3 px-0 py-0"
            >
              <Avatar
                alt={`${post.author.display_name}'s avatar`}
                className="size-10"
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
                <Text className="font-semibold" numberOfLines={1}>
                  {post.author.display_name}
                </Text>
                <Text variant="muted" numberOfLines={1}>
                  @{post.author.username} · {formatPostDate(post.created_at)}
                </Text>
              </View>
            </Button>
          </Link>
          <Badge variant="secondary">
            <Text>Ask</Text>
          </Badge>
        </View>

        <CardTitle
          className={isDetail ? "text-2xl leading-8" : "text-xl leading-7"}
        >
          {post.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="gap-4">
        {post.body ? <Text className="leading-6">{post.body}</Text> : null}

        {post.media.length > 0 ? (
          <View className="gap-3">
            {post.media.map((media, index) => (
              <Image
                key={media.id}
                accessibilityLabel={
                  media.alt_text ||
                  `Post image ${index + 1} of ${post.media.length}`
                }
                className={
                  isDetail
                    ? "h-72 w-full rounded-lg bg-muted sm:h-96"
                    : "h-52 w-full rounded-lg bg-muted sm:h-72"
                }
                contentFit="cover"
                source={media.signedUrl}
                transition={150}
              />
            ))}
          </View>
        ) : null}

        {actions ? (
          <View className="flex-row flex-wrap justify-end gap-3 border-t border-border pt-4">
            {actions}
          </View>
        ) : null}

        {!isDetail ? (
          <Link href={routes.post(post.id)} asChild>
            <Button variant="outline" className="self-start">
              <Text>View post</Text>
            </Button>
          </Link>
        ) : null}
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
