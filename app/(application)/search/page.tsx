"use client";

import { useState } from "react";
import { useDisclosure } from "@heroui/modal";

import { useFeedStore } from "../_store";

import FeedItemCard from "@/components/ui/feed-item-card";
import FeedItemModal from "@/components/ui/feed-item-modal";
import { Post } from "@/types/post";

export default function SearchPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { searchFeed } = useFeedStore((state) => state);

  const [currentPost, setCurrentPost] = useState<Post>(searchFeed.data[0]);

  const onFeedModalOpen = (post: Post) => {
    setCurrentPost(post);
    onOpen();
  };

  if (!searchFeed.loading && searchFeed.data.length == 0) {
    return (
      <p className="text-center mt-2 text-default-500 text-sm">
        Nothing here... Please try again!
      </p>
    );
  }

  const renderPosts = (post: Post) => {
    return (
      <FeedItemCard
        key={post.id}
        post={post}
        onFeedModalOpen={onFeedModalOpen}
      />
    );
  };

  return (
    <div className="sm:px-2 px-1 h-screen w-full">
      {searchFeed.data.flatMap(renderPosts)}
      <div>
        <ins
          className="adsbygoogle"
          data-ad-client="ca-pub-7974532258496573"
          data-ad-format="fluid"
          data-ad-layout-key="+2t+rl+2h-1m-4u"
          data-ad-slot="3581469001"
          style={{ display: "block" }}
        />
      </div>

      {isOpen && (
        <FeedItemModal
          key={currentPost.id}
          feedPost={currentPost}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </div>
  );
}
