import { Slider } from "@heroui/slider";
import { User as HeroUser } from "@heroui/user";
import { Divider } from "@heroui/divider";

import BusinessReviewMenu from "./business-review-menu";

import { BusinessReview } from "@/types/review";
import { getPostDateString } from "@/utils/date-utils";

export const BusinessReviewItem = ({ review }: { review: BusinessReview }) => {
  return (
    <div className="flex flex-col w-full justify-start items-start gap-3 bg-default-100 rounded-xl p-2 my-0.5">
      <div className="flex flex-row justify-between items-center w-full">
        <HeroUser
          avatarProps={{
            src: String(review.userProfileImage),
            showFallback: true,
          }}
          description={getPostDateString(review.createdAt)}
          name={review.userName || "Anonymous"}
        />
        <BusinessReviewMenu review={review} />
      </div>
      <Divider />
      <div className="flex flex-col w-full">
        {review.text && (
          <>
            <p className="text-small ext-default-600">{review.text}</p>
            <Divider className="my-3" />
          </>
        )}

        <div className="flex flex-row items-center gap-4">
          <Slider
            hideThumb
            classNames={{
              label: "text-default-600 text-tiny",
              value: "text-default-600 text-tiny",
              track: "mt-1",
            }}
            color="primary"
            label="Overall Rating"
            maxValue={5}
            minValue={0}
            size="sm"
            step={0.1}
            value={review.rating}
          />
          <Slider
            hideThumb
            classNames={{
              label: "text-default-600 text-tiny",
              value: "text-default-600 text-tiny",
              track: "mt-1",
            }}
            color="primary"
            label="Overall Rating"
            maxValue={5}
            minValue={0}
            size="sm"
            step={0.1}
            value={review.rating}
          />
        </div>
        <div className="flex flex-row items-center gap-4 py-2">
          <Slider
            hideThumb
            classNames={{
              label: "text-default-600 text-tiny",
              value: "text-default-600 text-tiny",
              track: "mt-1",
            }}
            color="primary"
            label="Overall Rating"
            maxValue={5}
            minValue={0}
            size="sm"
            step={0.1}
            value={review.rating}
          />
          <Slider
            hideThumb
            classNames={{
              label: "text-default-600 text-tiny",
              value: "text-default-600 text-tiny",
              track: "mt-1",
            }}
            color="primary"
            label="Overall Rating"
            maxValue={5}
            minValue={0}
            size="sm"
            step={0.1}
            value={review.rating}
          />
        </div>
      </div>
      <Divider />
      <Slider
        hideThumb
        classNames={{
          label: "text-default-600",
          value: "text-default-600 text-sm",
          track: "mt-1",
        }}
        color="primary"
        label="Overall Rating"
        maxValue={5}
        minValue={0}
        size="sm"
        step={0.1}
        value={review.rating}
      />
    </div>
  );
};
