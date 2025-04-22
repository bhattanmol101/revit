"use client";

import { useEffect, useState } from "react";
import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@heroui/spinner";

import { getPostsAction } from "./action";
import { useFeedStore } from "./_store";
import Loading from "./loading";
import PostModal from "./_components/post-modal";

import FeedItemCard from "@/components/ui/feed-item-card";
import FeedItemModal from "@/components/ui/feed-item-modal";
import { Post } from "@/types/post";
import { useGlobalStore } from "@/store";
import { POST_LIMIT } from "@/utils/constants";

export default function HomePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { ref, inView } = useInView();

  const {
    isOpen: isPostModalOpen,
    onOpen: onPostModalOpen,
    onOpenChange: onPostModalOpenChange,
  } = useDisclosure();

  const { globalState } = useGlobalStore((state) => state);

  const { feed, setFeed, page, setPage } = useFeedStore((state) => state);

  const [isMoreLoading, setIsMoreLoading] = useState<boolean>(false);

  const [currentPost, setCurrentPost] = useState<Post>(feed.data[0]);

  const onFeedModalOpen = (post: Post) => {
    setCurrentPost(post);
    onOpen();
  };

  useEffect(() => {
    const fetchPosts = async (page: number) => {
      if (page != 0) {
        if (!globalState.auth) {
          return;
        }
        setIsMoreLoading(true);
      }

      if (feed.data.length > page * POST_LIMIT) {
        setIsMoreLoading(false);

        return;
      }

      const resp = await getPostsAction("", page);

      if (resp) {
        setIsMoreLoading(false);
        setFeed({
          ...feed,
          loading: false,
          success: true,
          error: "",
          data: [...feed.data, ...resp],
        });
      }
    };

    fetchPosts(page);
  }, [globalState.auth, page]);

  useEffect(() => {
    if (inView) {
      setPage(Math.floor(feed.data.length / POST_LIMIT));
    }
  }, [inView]);

  if (page == 0 && feed.loading) {
    return <Loading />;
  }

  if (!feed.loading && feed.data.length == 0) {
    return (
      <p className="text-center mt-2 text-default-500 text-sm">
        No posts yet...
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
    <div className="sm:px-2 px-1 h-screen w-full py-1">
      {globalState.auth && (
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

      {feed.data.flatMap(renderPosts)}
      <div ref={ref} className="flex flex-col justify-center items-center py-2">
        {inView && isMoreLoading && <Spinner />}
      </div>
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
            <a href="/signup">signup</a>
          </span>{" "}
          now on revit...
        </p>
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
