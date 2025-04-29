"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { User } from "@heroui/user";

import { getPostDateString } from "@/utils/date-utils";
import { Forum } from "@/types/forum";

export default function ForumFeedItem({ forum }: { forum: Forum }) {
  return (
    <Card className="w-full my-0.5">
      <CardHeader className="justify-between">
        <User
          avatarProps={{
            src: String(forum.userProfileImage),
            showFallback: true,
          }}
          description={getPostDateString(forum.createdAt)}
          name={forum.userName}
        />
      </CardHeader>
      <CardBody className="overflow-visible px-3 py-0">
        <p className="text-small text-default-600 whitespace-pre-line">
          {forum.description}
        </p>
      </CardBody>
      <Divider className="mt-2" />
      <CardFooter className="flex flex-row justify-between p-2 gap-4">
        {/* <div className="flex flex-row items-center w-full gap-2">
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
        > */}
        <p className="text-default-500 text-sm -ml-1">Revit</p>
        {/* </Button> */}
      </CardFooter>
    </Card>
  );
}
