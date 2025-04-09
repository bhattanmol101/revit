"use client";

import { useEffect, useState } from "react";
import { useDisclosure } from "@heroui/modal";

import { getAllPostAction } from "./action";
import { useFeedStore } from "./_store";
import Loading from "./loading";

import FeedItemCard from "@/components/ui/feed-item-card";
import FeedItemModal from "@/components/ui/feed-item-modal";
import { Post } from "@/types/post";

export default function HomePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { feed, setFeed } = useFeedStore((state) => state);

  const [currentPost, setCurrentPost] = useState<Post>(feed.data[0]);

  const onFeedModalOpen = (post: Post) => {
    setCurrentPost(post);
    onOpen();
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const resp = await getAllPostAction("123");

      setFeed({
        ...feed,
        loading: false,
        success: resp.success,
        error: String(resp.error.message),
        data: resp.posts,
      });
    };

    fetchPosts();
  }, []);

  return (
    <div className="sm:px-5 px-1 h-screen w-full">
      {feed.loading && <Loading />}
      {!feed.loading && feed.data.length == 0 && (
        <p className="text-center mt-2 text-default-500 text-sm">
          No posts yet...
        </p>
      )}
      {!feed.loading &&
        feed.data.map((post) => (
          <FeedItemCard
            key={post.id}
            post={post}
            onFeedModalOpen={onFeedModalOpen}
          />
        ))}
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
