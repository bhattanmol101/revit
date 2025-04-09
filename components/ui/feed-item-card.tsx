"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";
import { Divider } from "@heroui/divider";
import { User } from "@heroui/user";

import { MenuIcon, RevitIcon } from "../icons";

import FeedFileSlider from "./feed-file-slider";

import { Post } from "@/types/post";
import { useGlobalStore } from "@/store";
import { getPostDateString } from "@/utils/date-utils";

export default function FeedItemCard({
  post,
  onFeedModalOpen,
}: {
  post: Post;
  onFeedModalOpen?: (post: Post) => void;
}) {
  const { globalState } = useGlobalStore((state) => state);

  const onOpen = () => {
    onFeedModalOpen && onFeedModalOpen(post);
  };

  const rating = post.rating
    ? Number(post.rating) / Number(post.totalReviews)
    : 0;

  return (
    <>
      <Card className="w-full my-2">
        <CardHeader className="justify-between">
          <User
            avatarProps={{
              src: String(post.userProfileImage),
              showFallback: true,
            }}
            description={getPostDateString(post.createdAt)}
            name={post.userName}
          />

          <Button
            isIconOnly
            aria-label="menu"
            isDisabled={!globalState.auth}
            size="sm"
            variant="light"
          >
            <MenuIcon size={24} />
          </Button>
        </CardHeader>
        <CardBody className="overflow-visible px-3 py-0">
          <p className="text-small text-default-600">{post.text}</p>
          {post.hashtags.map((item) => (
            <span key={item}>{item}</span>
          ))}
          <FeedFileSlider files={post.fileList} />
        </CardBody>
        <Divider className="mt-2" />
        <CardFooter className="flex flex-row justify-between p-2 gap-4">
          <div className="flex flex-row items-center w-full gap-2">
            <Slider
              hideThumb
              aria-label="rating"
              color="primary"
              maxValue={5}
              minValue={0}
              size="sm"
              value={rating}
            />
            <p className="font-semibold text-default-400 text-small flex flex-row items-center">
              <span>{rating}&nbsp;</span>
              <span>({post.totalReviews})</span>
            </p>
          </div>
          <Button
            isDisabled={!globalState.auth}
            radius="full"
            size="sm"
            startContent={<RevitIcon size={30} />}
            variant="light"
            onPress={onOpen}
          >
            <p className="text-default-500 text-sm -ml-1">revit</p>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
