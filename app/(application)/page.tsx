"use client";

import { useEffect, useState } from "react";
import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";

import { getAllPostAction } from "./action";
import { useFeedStore } from "./_store";
import Loading from "./loading";
import PostModal from "./post-modal";

import FeedItemCard from "@/components/ui/feed-item-card";
import FeedItemModal from "@/components/ui/feed-item-modal";
import { Post } from "@/types/post";
import { useGlobalStore } from "@/store";

export default function HomePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    isOpen: isPostModalOpen,
    onOpen: onPostModalOpen,
    onOpenChange: onPostModalOpenChange,
  } = useDisclosure();

  const { globalState } = useGlobalStore((state) => state);

  const { feed, setFeed } = useFeedStore((state) => state);

  const [currentPost, setCurrentPost] = useState<Post>(feed.data[0]);

  const onFeedModalOpen = (post: Post) => {
    setCurrentPost(post);
    onOpen();
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const limit = globalState.auth ? 8 : 3;

      const resp = await getAllPostAction(String(globalState.user?.id), limit);

      setFeed({
        ...feed,
        loading: false,
        success: resp.success,
        error: String(resp.error.message),
        data: resp.posts,
      });
    };

    fetchPosts();
  }, [globalState.auth]);

  return (
    <div className="sm:px-2 px-1 h-screen w-full">
      {feed.loading && <Loading />}
      {!feed.loading && globalState.auth && (
        <div className="w-full flex flex-col sm:hidden mt-2">
          <Button
            fullWidth={true}
            radius="full"
            size="sm"
            type="submit"
            variant="shadow"
            onPress={onPostModalOpen}
          >
            <p className="text-sm">Want something reviewed...?</p>
          </Button>
          <Divider className="w-[98vw] mt-2" />
        </div>
      )}
      {!feed.loading && feed.data.length == 0 && (
        <p className="text-center mt-2 text-default-500 text-sm">
          No posts yet...
        </p>
      )}
      {!feed.loading && (
        <>
          {feed.data.map((post) => (
            <FeedItemCard
              key={post.id}
              post={post}
              onFeedModalOpen={onFeedModalOpen}
            />
          ))}
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
          {!globalState.auth && (
            <p className="text-center pt-2 pb-5 text-default-500 text-base">
              See more reviews or share your experience{" "}
              <span className="text-primary-500">
                <a href="/signup">sigup</a>
              </span>{" "}
              now on revit...
            </p>
          )}
        </>
      )}
      {isOpen && (
        <FeedItemModal
          key={currentPost.id}
          feedPost={currentPost}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
      <PostModal
        isOpen={isPostModalOpen}
        onOpenChange={onPostModalOpenChange}
      />
    </div>
  );
}
