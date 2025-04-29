import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Key } from "@react-types/shared";

import { DeleteIcon, MenuIcon } from "../../../../../components/icons";
import { useBusinessReviewStore } from "../_store";

import { useGlobalStore } from "@/store";
import { BusinessReview } from "@/types/review";

function BusinessReviewMenu({
  review,
  onModalChange,
}: {
  review: BusinessReview;
  onModalChange?: () => void;
}) {
  const { reviews, setBusinessReviews } = useBusinessReviewStore(
    (state) => state
  );

  const { globalState } = useGlobalStore((state) => state);

  const onMenuAction = (key: Key) => {
    if (key == "delete") {
      //TODO Need to fix this
      // deletePostAction(review.id);

      const newReviews = reviews.data.filter((item) => item.id !== review.id);

      setBusinessReviews({
        ...reviews,
        data: newReviews,
      });

      onModalChange && onModalChange();
    }
  };

  if (globalState.user?.id !== review.userId) {
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

export default BusinessReviewMenu;
