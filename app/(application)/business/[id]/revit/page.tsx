"use client";

import { useDisclosure } from "@heroui/modal";
import { SliderValue } from "@heroui/slider";
import { useState } from "react";

import AlertModal from "../../../../../components/ui/alert-modal";

import { ReviewReqest } from "@/types/post";
import { addReviewToPostAction } from "@/app/(application)/action";
import { PageState } from "@/types";
import { useGlobalStore } from "@/store";
import FnBForm from "@/components/forms/fnb";

export default function BusinessReviewPage({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const { globalState } = useGlobalStore((state) => state);

  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onOpenChange: onAlertOpenChange,
  } = useDisclosure();

  const [pageState, setPageState] = useState<PageState>({
    loading: false,
    disabled: false,
    success: false,
    error: null,
  });

  const onRatingChange = (value: SliderValue) => {
    setRating(Array.isArray(value) ? value[0] : value);
  };

  const onTextChange = (value: string) => {
    setText(value);
  };

  const onSubmit = async () => {
    if (rating == 0 && !isAlertOpen) {
      onAlertOpen();

      return;
    }
    setPageState((prevState) => ({
      ...prevState,
      disabled: true,
      loading: true,
    }));

    const review: ReviewReqest = {
      userId: String(globalState.user?.id),
      text: text,
      rating: rating,
    };

    const res = await addReviewToPostAction("post.data.id", review);

    setPageState((prevState) => ({
      ...prevState,
      disabled: false,
      loading: false,
      success: res.success,
      error: res.error,
    }));

    onOpenChange();
  };

  return (
    <div className="p-6">
      <div className="bg-default-100 rounded-md py-2 px-3">
        Your review for {"post.data.userName"}
      </div>
      <div className="py-6">
        <FnBForm />
      </div>
      <AlertModal
        description="You are about to give this post a zero rating."
        isOpen={isAlertOpen}
        pageState={pageState}
        title="Post Rating"
        onContinue={onSubmit}
        onOpenChange={onAlertOpenChange}
      />
    </div>
  );
}
