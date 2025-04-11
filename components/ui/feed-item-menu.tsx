import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Key } from "@react-types/shared";

import { DeleteIcon, MenuIcon } from "../icons";

import { deletePostAction } from "@/app/(application)/action";
import { useFeedStore } from "@/app/(application)/_store";
import { Post } from "@/types/post";
import { useGlobalStore } from "@/store";

function FeedItemMenu({
  post,
  onModalChange,
}: {
  post: Post;
  onModalChange?: () => void;
}) {
  const { feed, setFeed } = useFeedStore((state) => state);

  const { globalState } = useGlobalStore((state) => state);

  const onMenuAction = (key: Key) => {
    if (key == "delete") {
      deletePostAction(post.id);

      const newPosts = feed.data.filter((item) => item.id !== post.id);

      setFeed({
        ...feed,
        data: newPosts,
      });

      onModalChange && onModalChange();
    }
  };

  if (globalState.user?.id !== post.userId) {
    return <></>;
  }

  return (
    <Dropdown size="sm">
      <DropdownTrigger>
        <Button
          isIconOnly
          aria-label="menu"
          className="hidden sm:flex"
          isDisabled={!globalState.auth}
          size="sm"
          variant="light"
          onPress={() => {}}
        >
          <MenuIcon size={24} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" onAction={onMenuAction}>
        <DropdownItem
          key="delete"
          className="text-danger"
          color="danger"
          startContent={<DeleteIcon size={16} />}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default FeedItemMenu;
