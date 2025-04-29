"use client";

import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { useState } from "react";
import { Alert } from "@heroui/alert";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { useDisclosure } from "@heroui/modal";

import AlertModal from "../ui/alert-modal";

import { PageState } from "@/types";
import { PRICE_PP, VISIT } from "@/utils/constants";
import { Business } from "@/types/business";
import { FnBReview } from "@/types/form";
import { BusinessReviewRequest } from "@/types/review";
import { saveReviewForBusinessAction } from "@/app/(application)/business/[id]/revit/action";
import { User } from "@/types/user";

export default function FnBForm({
  business,
  user,
}: {
  business: Business;
  user?: User;
}) {
  const [review, updateReview] = useState<PageState>({
    disabled: false,
    loading: false,
    success: false,
    error: null,
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onSubmit = async (e: any) => {
    e.preventDefault();

    // if (rating == 0 && !isOpen) {
    //   onOpen();

    //   return;
    // }

    // await onRatingSubmit();

    updateReview((review) => ({
      ...review,
      loading: true,
    }));

    const data = Object.fromEntries(new FormData(e.currentTarget)) as FnBReview;

    const businessReview: BusinessReviewRequest = {
      businessId: business.id,
      rating: Number(data.rating),
      text: data.text,
      userName: data.name,
      userId: user?.id,
      json: {
        food: Number(data.food),
        ambience: Number(data.ambience),
        service: Number(data.service),
        vibe: Number(data.vibe),
        price: data.price,
        servicePerson: data.servicePerson,
        visit: data.visit,
      },
    };

    const resp = await saveReviewForBusinessAction(business.id, businessReview);

    updateReview((review) => ({
      ...review,
      loading: false,
      success: resp.success,
      error: resp.error,
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {(review.disabled || review.error) && (
        <Alert
          className="sm:mb-5 mb-2"
          color={review.success ? "success" : "danger"}
          title={
            review.success
              ? "Thank you for your review!"
              : review.error?.message
          }
        />
      )}
      <Form
        className="flex flex-col items-center sm:gap-4 gap-2 w-full"
        validationBehavior="native"
        onSubmit={onSubmit}
      >
        <Slider
          className="w-full"
          color="primary"
          label="Overall Rating"
          maxValue={5}
          minValue={0}
          name="rating"
          size="sm"
          step={0.5}
        />
        <div className="flex flex-row items-start gap-4 w-full">
          <Slider
            className="w-full pb-1"
            color="primary"
            label="Food"
            maxValue={5}
            minValue={0}
            name="food"
            size="sm"
            step={0.5}
          />
          <Slider
            className="w-full pb-1"
            color="primary"
            label="Ambience"
            maxValue={5}
            minValue={0}
            name="ambience"
            size="sm"
            step={0.5}
          />
        </div>
        <div className="flex flex-row items-start gap-4 w-full">
          <Slider
            className="w-full pb-1"
            color="primary"
            label="Service"
            maxValue={5}
            minValue={0}
            name="service"
            size="sm"
            step={0.5}
          />
          <Slider
            className="w-full pb-1"
            color="primary"
            label="Vibe"
            maxValue={5}
            minValue={0}
            name="vibe"
            size="sm"
            step={0.5}
          />
        </div>
        <Textarea
          aria-label="Description"
          className="col-span-12 md:col-span-6 mb-6 md:mb-0 whitespace-pre"
          maxRows={100}
          name="text"
          placeholder="Tell in brief about your expirience"
          variant="faded"
        />
        <div className="flex flex-row items-start gap-2 w-full">
          <Input
            description={!user && "Empty for anonymous"}
            errorMessage="Please enter a valid name"
            label="Name"
            name="name"
            placeholder="e.g. Anmol Bhat"
            type="text"
            value={user && user.name}
            variant="faded"
          />

          <Select label="Price per person" name="price" variant="faded">
            {PRICE_PP.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-row items-start gap-2 w-full">
          <Input
            errorMessage="Please enter a valid name"
            label="Service Person"
            name="servicePerson"
            placeholder="e.g. Anmol Bhat"
            type="text"
            variant="faded"
          />
          <Select label="When did you visit?" name="visit" variant="faded">
            {VISIT.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        </div>
        <Button
          className="mt-2"
          color="primary"
          fullWidth={true}
          isDisabled={review.disabled}
          isLoading={review.loading}
          spinnerPlacement="end"
          type="submit"
        >
          Post
        </Button>
      </Form>
      <AlertModal
        description="You are about to give this business a zero rating"
        isOpen={isOpen}
        pageState={review}
        title={`${business.name}'s Review`}
        onContinue={onSubmit}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
