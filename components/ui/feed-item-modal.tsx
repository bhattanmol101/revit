import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Avatar } from "@heroui/avatar";
import { Slider, SliderValue } from "@heroui/slider";
import { Divider } from "@heroui/divider";
import { Textarea } from "@heroui/input";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { User } from "@heroui/user";

import { MenuIcon } from "../icons";

import { FeedReview } from "./feed-review";
import FeedFileSlider from "./feed-file-slider";
import AlertModal from "./alert-modal";

import { Post, Review, ReviewReqest } from "@/types/post";
import {
  addReviewToPostAction,
  getPostReviewsByIdAction,
} from "@/app/(application)/action";
import { PageState } from "@/types";
import { getPostDateString } from "@/utils/date-utils";
import { useGlobalStore } from "@/store";

export default function FeedItemModal({
  isOpen,
  onOpenChange,
  feedPost,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  feedPost: Post;
}) {
  const [post, setPost] = useState({
    loading: true,
    data: feedPost,
  });

  const {globalState} = useGlobalStore((state) => state)

  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);

  const postRating = post.data.rating  ? Number(post.data.rating)/Number(post.data.totalReviews) : 0

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

  useEffect(() => {
    const fetchPost = async () => {
      const resp = await getPostReviewsByIdAction(feedPost.id);

      if (resp.reviews) {
        setPost({
          ...post,
          loading: false,
          data: {...feedPost, reviews: resp.reviews},
        });
      }
    };

    fetchPost();
  }, []);

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
      userId: globalState.user?.id,
      text: text,
      rating: rating,
    };

    const res = await addReviewToPostAction(
      post.data.id,
      review,
    );

    setPageState((prevState) => ({
      ...prevState,
      disabled: false,
      loading: false,
      success: res.success,
      error: res.error,
    }));

    onOpenChange()
  };

  return (
    <Modal
      key={post.data.id}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
        Your review for {post.data.userName}&apos;s post
        </ModalHeader>
        <ModalBody key={post.data.id}>
          <div className="flex flex-row justify-between">
            <User
              avatarProps={{
                src: String(post.data.userProfileImage),
              }}
              description={getPostDateString(post.data.createdAt)}
              name={post.data.userName}
            />
            <Button isIconOnly aria-label="menu" size="sm" variant="light">
              <MenuIcon size={24} />
            </Button>
          </div>
          <div className="overflow-visible">
            <p className="text-small text-default-600">{post.data.text}</p>
            {post.data.hashtags.map((item) => (
              <span key={item}>{item}</span>
            ))}
            <FeedFileSlider files={post.data.fileList} />
          </div>
          <Divider />
          <div className="flex flex-row w-full gap-2">
            <Slider
              hideThumb
              className="w-full"
              color="primary"
              label={`Reviews (${post.data.totalReviews})`}
              maxValue={5}
              minValue={0}
              size="sm"
              step={0.1}
              value={postRating}
            />
          </div>
          <Divider />

          {post.loading && <Spinner className="py-2" />}

          {!post.loading &&
            (post.data.reviews && post.data.reviews.length > 0 ? (
              post.data.reviews.map((item) => (
                <FeedReview key={item.id} review={item} />
              ))
            ) : (
              <p className="text-center text-default-500 text-sm pb-3">
                No reviews yet...
              </p>
            ))}
        </ModalBody>
        <ModalFooter className="flex flex-col items-center justify-start w-full border-t">
          <Slider
            className="w-full pb-1"
            color="primary"
            label="What would you rate it?"
            maxValue={5}
            minValue={0}
            size="sm"
            step={0.1}
            value={rating}
            onChange={onRatingChange}
          />
          <div className="flex flex-row gap-2 w-full items-center justify-center">
            <div>
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={globalState.user?.profileImage}
              />
            </div>
            <Textarea
              aria-label="review"
              errorMessage="Please enter a valid email"
              minRows={1}
              name="email"
              placeholder="Add your review...."
              type="text"
              onValueChange={onTextChange}
            />
            <Button
              color="primary"
              disabled={pageState.disabled}
              isLoading={pageState.loading}
              spinnerPlacement="end"
              onPress={onSubmit}
            >
              Revit
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
      <AlertModal
        description="You are about to give this post a zero rating."
        isOpen={isAlertOpen}
        pageState={pageState}
        title="Post Rating"
        onContinue={onSubmit}
        onOpenChange={onAlertOpenChange}
      />
    </Modal>
  );
}
