"use client";

import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { useDisclosure } from "@heroui/modal";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";

import PostModal from "../app/(application)/post-modal";

import PostItemNav from "./ui/post-item-nav";

import { useGlobalStore } from "@/store";
import { getTopPostsAction } from "@/app/(application)/action";

export const RightBar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [loading, setLoading] = useState(true);

  const [post, setPost] = useState<any>(null);

  const { globalState } = useGlobalStore((state) => state);

  useEffect(() => {
    const fetchTopPost = async () => {
      const resp = await getTopPostsAction("");

      setLoading(false);
      if (resp) {
        setPost(resp);
      }
    };

    fetchTopPost();
  }, []);

  return (
    <div className="flex flex-row h-full fixed w-3/12">
      <Divider orientation="vertical" />
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-row">
          <div className="w-full p-2">
            {globalState.auth && (
              <Button
                fullWidth={true}
                size="lg"
                type="submit"
                variant="bordered"
                onPress={onOpen}
              >
                Want something reviewed...?
              </Button>
            )}
          </div>
          <ins
            className="adsbygoogle"
            data-ad-client="ca-pub-7974532258496573"
            data-ad-format="auto"
            data-ad-slot="6377418070"
            data-full-width-responsive="true"
            style={{ display: "block" }}
          />
          <PostModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>
        <Divider className="my-3" />
        <div className="flex flex-col justify-center items-center px-2">
          <p className="mb-2 py-1 text-sm text-white bg-gray-500 w-full text-center rounded-sm">
            Top trending review
          </p>
          {loading && <Spinner />}
          {post && <PostItemNav post={post} />}
        </div>
      </div>
    </div>
  );
};
