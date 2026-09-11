import { Image, type ImageLoadEventData } from "expo-image";
import { useState } from "react";
import { View } from "react-native";

import type { PostWithDetails } from "@/api/posts";

const MIN_FEED_ASPECT_RATIO = 4 / 5;
const MAX_FEED_ASPECT_RATIO = 16 / 9;

export function PostMediaGallery({
  isDetail = false,
  media,
}: {
  isDetail?: boolean;
  media: PostWithDetails["media"];
}) {
  if (media.length === 0) return null;

  return (
    <View className="gap-px bg-border">
      {media.map((item, index) => (
        <PostMedia
          key={item.id}
          item={item}
          isDetail={isDetail}
          position={index + 1}
          total={media.length}
        />
      ))}
    </View>
  );
}

function PostMedia({
  item,
  isDetail,
  position,
  total,
}: {
  item: PostWithDetails["media"][number];
  isDetail: boolean;
  position: number;
  total: number;
}) {
  const [aspectRatio, setAspectRatio] = useState(1);

  const handleLoad = ({ source }: ImageLoadEventData) => {
    if (!source.width || !source.height) return;
    const naturalRatio = source.width / source.height;
    setAspectRatio(
      isDetail
        ? naturalRatio
        : Math.min(
            MAX_FEED_ASPECT_RATIO,
            Math.max(MIN_FEED_ASPECT_RATIO, naturalRatio),
          ),
    );
  };

  return (
    <Image
      accessibilityLabel={item.alt_text || `Post image ${position} of ${total}`}
      className="w-full bg-muted"
      contentFit="contain"
      onLoad={handleLoad}
      recyclingKey={item.id}
      source={{ uri: item.signedUrl }}
      style={{ width: "100%", aspectRatio }}
      transition={150}
    />
  );
}
