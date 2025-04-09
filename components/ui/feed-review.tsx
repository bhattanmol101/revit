import { Slider } from "@heroui/slider";
import { Avatar } from "@heroui/avatar";

import { Review } from "@/types/post";

export const FeedReview = ({ review }: { review: Review }) => {
  return (
    <div className="flex flex-row w-full gap-3 mb-1">
      <div className="mt-1">
        <Avatar src={String(review.userProfileImage)} />
      </div>
      <div className="flex flex-col justify-center items-start w-full bg-default-100 rounded-xl px-3 py-2">
        <Slider
          hideThumb
          classNames={{
            labelWrapper: "mb-0 text-tiny",
            label: "text-default-600 text-tiny",
            value: "text-default-600 text-tiny",
            track: "m-0 p-0",
          }}
          color="primary"
          label={review.userName}
          maxValue={5}
          minValue={0}
          size="sm"
          step={0.1}
          value={review.rating}
        />
        <p className="text-tiny text-default-600 pt-2">{review.text}</p>
      </div>
    </div>
  );
};
