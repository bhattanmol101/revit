"use client";

import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import React, { useEffect, useState } from "react";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { useParams } from "next/navigation";

import { fetchForumByIdAction, getForumPostsAction } from "../action";

import ForumPostModal from "./_components/post-modal";

import { getJoingDateString } from "@/utils/date-utils";
import { EditIcon } from "@/components/icons";
import { Forum, ForumPostFeed } from "@/types/forum";
import FeedItemCard from "@/components/ui/feed-item-card";

function ForumPage() {
  const { id } = useParams();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [loading, setLoading] = useState(true);

  const [forum, setForum] = useState<Forum>();

  const [posts, setPosts] = useState<ForumPostFeed[]>();

  useEffect(() => {
    const fetchForum = async () => {
      const forum = await fetchForumByIdAction(String(id));

      setLoading(false);
      if (forum) {
        setForum(forum);
      }

      const posts = await getForumPostsAction(String(id), 0);

      if (posts) {
        setPosts(posts);
      }
    };

    fetchForum();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col items-center sm:w-full w-screen p-1">
      <div className="w-full">
        <div className="flex flex-row justify-between items-start w-full px-2">
          <div className="flex flex-row items-center ">
            <Avatar
              showFallback
              className="sm:w-24 sm:h-24 h-20 w-20"
              src={String(forum?.logo)}
            />
            <div className="pl-5">
              <p className="sm:text-xl font-bold">{forum?.name}</p>
              <p className="text-default-600 sm:text-sm text-sm">
                Since: {forum && getJoingDateString(new Date(forum.createdAt))}
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center gap-2 p-2">
            <Button
              color="primary"
              size="sm"
              spinnerPlacement="end"
              variant="flat"
            >
              Join
            </Button>
            <Button
              color="primary"
              size="sm"
              spinnerPlacement="end"
              variant="flat"
              onPress={onOpen}
            >
              Revit
            </Button>
            <Button
              isIconOnly
              color="default"
              size="sm"
              spinnerPlacement="end"
              onPress={onOpen}
            >
              <EditIcon size={20} />
            </Button>
          </div>
        </div>
        <Divider className="my-3" />
        <p className="text-default-700 sm:text-sm text-sm px-2">
          {forum?.description}
        </p>
      </div>
      <Divider className="mt-3 mb-1" />
      {/* {posts.loading && <Spinner size="sm" />} */}
      {posts &&
        posts.map((post: any) => (
          <FeedItemCard
            key={post.id}
            post={post}
            onFeedModalOpen={onOpenChange}
          />
        ))}
      <ForumPostModal
        forumId={id}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}

export default ForumPage;
