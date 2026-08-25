import { Image } from "expo-image";
import { Link } from "expo-router";
import { MessageCircle, Star } from "lucide-react-native";
import { View } from "react-native";
import type { Restaurant } from "@/api/restaurants";
import type { SharePostWithDetails } from "@/api/shares";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { routes } from "@/lib/routes";
import { useCommentCount } from "@/queries/comments";

export function SharePostCard({
  post,
  restaurant,
}: {
  post: SharePostWithDetails;
  restaurant: Restaurant;
}) {
  const theme = useTheme();
  const comments = useCommentCount(post.id);
  const commentCount = comments.data ?? 0;

  return (
    <Card className="gap-0 overflow-hidden rounded-lg pb-0 pt-0.5 shadow-none">
      <CardHeader className="gap-2 px-3 pt-2">
        <View className="flex-row items-start justify-between gap-3">
          <Link href={routes.user(post.author.username)} asChild>
            <Button
              className="h-auto min-w-0 flex-1 justify-start gap-2 px-0 py-0"
              variant="ghost"
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
              SHARE
            </Text>
          </Badge>
        </View>

        <Link href={routes.restaurant(restaurant.id)} asChild>
          <Button
            className="h-auto justify-start gap-1 px-0 py-0"
            variant="ghost"
          >
            <Text className="text-base font-semibold">{restaurant.name}</Text>
            <Text className="text-xs text-muted-foreground">
              {restaurant.locality}
            </Text>
          </Button>
        </Link>

        <View className="flex-row items-center gap-1.5">
          <Icon as={Star} className="size-5 text-rating" fill={theme.rating} />
          <Text className="text-base font-semibold">
            {post.ratingScore.toFixed(1)}
          </Text>
        </View>
      </CardHeader>

      <CardContent className="gap-2 px-0 pt-1">
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
              />
            ))}
          </View>
        ) : null}

        <View className="px-3 pb-1">
          <Link href={routes.post(post.id)} asChild>
            <Button
              accessibilityLabel={`View ${commentCount} ${commentCount === 1 ? "comment" : "comments"}`}
              className="h-9 self-start rounded-md px-2"
              variant="ghost"
            >
              <Icon as={MessageCircle} className="size-5 text-foreground" />
              <Text className="text-sm font-semibold">
                {comments.isLoading || comments.isError ? "—" : commentCount}
              </Text>
            </Button>
          </Link>
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
