"use client";

import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { useDisclosure } from "@heroui/modal";

import PostModal from "../app/(application)/post-modal";

import { useGlobalStore } from "@/store";

export const RightBar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { globalState } = useGlobalStore((state) => state);

  return (
    <div className="flex flex-row h-full fixed w-3/12">
      <div>
        <Divider orientation="vertical" />
      </div>
      <div className="w-full p-2">
        {globalState.auth && (
          <Button
            fullWidth={true}
            size="lg"
            type="submit"
            variant="bordered"
            onPress={onOpen}
          >
            Want something reviewd?
          </Button>
        )}
      </div>
      <PostModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};
