"use client";

import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { useState } from "react";
import { Alert } from "@heroui/alert";
import { Select, SelectItem } from "@heroui/select";
import { SharedSelection } from "@heroui/system";
import { Slider } from "@heroui/slider";

import { SignupUser } from "@/types/user";
import { PageState } from "@/types";
import { INDUSTRIES } from "@/utils/constants";

export default function FnBForm() {
  const [signup, updateSignup] = useState<PageState>({
    disabled: false,
    loading: false,
    success: false,
    error: null,
  });

  const [description, setDescription] = useState<string>("");

  const onSelectionChange = (keys: SharedSelection) => {
    console.log(keys);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    updateSignup((signup) => ({
      ...signup,
      loading: true,
    }));

    const data = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as SignupUser;

    // updateSignup({
    //   disabled: res.success,
    //   loading: false,
    //   success: res.success,
    //   error: res.error,
    // });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {(signup.disabled || signup.error) && (
        <Alert
          className="sm:mb-5 mb-2"
          color={signup.success ? "success" : "danger"}
          title={
            signup.success
              ? "Thanks for signing up! Please check your email for verification link."
              : signup.error?.message
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
          label="What would you rate it?"
          maxValue={5}
          minValue={0}
          size="sm"
          step={0.5}
          //   value={rating}
          //   onChange={onRatingChange}
        />
        <div className="flex flex-row items-start gap-4 w-full">
          <Slider
            className="w-full pb-1"
            color="primary"
            label="How was the food?"
            maxValue={5}
            minValue={0}
            size="sm"
            step={0.5}
            //   value={rating}
            //   onChange={onRatingChange}
          />
          <Slider
            className="w-full pb-1"
            color="primary"
            label="What was the ambience like?"
            maxValue={5}
            minValue={0}
            size="sm"
            step={0.5}
            //   value={rating}
            //   onChange={onRatingChange}
          />
        </div>
        <div className="flex flex-row items-start gap-4 w-full">
          <Slider
            className="w-full pb-1"
            color="primary"
            label="Was the service good?"
            maxValue={5}
            minValue={0}
            size="sm"
            step={0.5}
            //   value={rating}
            //   onChange={onRatingChange}
          />
          <Slider
            className="w-full pb-1"
            color="primary"
            label="How was the vibe?"
            maxValue={5}
            minValue={0}
            size="sm"
            step={0.5}
            //   value={rating}
            //   onChange={onRatingChange}
          />
        </div>
        <Textarea
          aria-label="Description"
          className="col-span-12 md:col-span-6 mb-6 md:mb-0 whitespace-pre"
          maxRows={100}
          placeholder="Tell in brief about your expirience"
          variant="faded"
          onValueChange={setDescription}
        />
        <div className="flex flex-row items-start gap-2 w-full">
          <Input
            description="Empty for anonymous"
            errorMessage="Please enter a valid name"
            label="Name"
            name="name"
            placeholder="e.g. Anmol Bhat"
            type="name"
            variant="faded"
          />

          <Select
            label="Price per person"
            name="industry"
            variant="faded"
            onSelectionChange={onSelectionChange}
          >
            {INDUSTRIES.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex flex-row items-start gap-2 w-full">
          <Select
            label="Did you dine-in?"
            name="industry"
            variant="faded"
            onSelectionChange={onSelectionChange}
          >
            {INDUSTRIES.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
          <Select
            label="When did you visit?"
            name="industry"
            variant="faded"
            onSelectionChange={onSelectionChange}
          >
            {INDUSTRIES.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        </div>
        <Button
          className="mt-2"
          color="primary"
          fullWidth={true}
          isDisabled={signup.disabled}
          isLoading={signup.loading}
          size="sm"
          spinnerPlacement="end"
          type="submit"
        >
          Post
        </Button>
      </Form>
    </div>
  );
}
