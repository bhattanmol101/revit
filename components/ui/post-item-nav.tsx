"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Slider } from "@heroui/slider";
import { Divider } from "@heroui/divider";
import { User } from "@heroui/user";

import FeedFileSlider from "./feed-file-slider";

import { Post } from "@/types/post";
import { getPostDateString } from "@/utils/date-utils";
import { getRating } from "@/utils/utils";

export default function PostItemNav({ post }: { post: Post }) {
  const rating = post.rating
    ? getRating(Number(post.rating), Number(post.totalReviews))
    : 0;

  return (
    <Card className="w-full my-1">
      <CardHeader className="justify-between">
        <User
          avatarProps={{
            src: String(post.userProfileImage),
            showFallback: true,
          }}
          description={getPostDateString(post.createdAt)}
          name={post.userName}
        />
      </CardHeader>
      <CardBody className="overflow-visible px-3 py-0">
        <p className="text-small text-default-600 whitespace-pre-line">
          {post.text}
        </p>
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
      </CardFooter>
    </Card>
  );
}
