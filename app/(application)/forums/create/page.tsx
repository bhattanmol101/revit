"use client";

import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { Form } from "@heroui/form";
import { useRouter } from "next/navigation";

import { FileInput } from "../../../../components/ui/FileInput";
import { saveForumAction } from "../action";

import { PageState } from "@/types";
import { initPostState } from "@/utils/utils";
import { useGlobalStore } from "@/store";
import { INDUSTRIES } from "@/utils/constants";
import { ForumForm } from "@/types/form";
import { ForumRequest } from "@/types/forum";

export default function CreateReviewForumPage() {
  const { globalState } = useGlobalStore((state) => state);

  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>(initPostState());

  const [logo, setLogo] = useState<Blob>();

  const onLogoChange = (e: any) => {
    e.preventDefault();

    setLogo(e.target.files[0]);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const forumData = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as ForumForm;

    setPageState((prevState) => ({
      ...prevState,
      disabled: true,
      loading: true,
    }));

    let forumRequest: ForumRequest = {
      adminId: String(globalState.user?.id),
      name: forumData.name,
      description: forumData.description,
      industry: forumData.industry,
    };

    const res = await saveForumAction(forumRequest, logo);

    setPageState((prevState) => ({
      ...prevState,
      disabled: false,
      loading: false,
      success: res.success,
      error: res.error,
    }));

    if (res.success) {
      router.replace(`/forums/${res.id}`);
    }
  };

  return (
    <div className="py-3 px-2">
      <div className="bg-default-100 rounded-md py-2 px-3 font-semibold">
        Create your own Review Forum
      </div>
      <div className="py-6">
        <Form
          className="flex flex-col items-center"
          id="addForumForm"
          onSubmit={onSubmit}
        >
          <FileInput
            accept="image/*"
            className="w-28 h-28 rounded-full"
            handleFileUpload={onLogoChange}
            icon={
              <Avatar
                className="w-28 h-28"
                src={logo && URL.createObjectURL(logo)}
              />
            }
          />
          <p className="text-default-700 text-small pb-2">Add Image</p>
          <div className="flex flex-row items-center gap-2 w-full">
            <Input
              isRequired
              errorMessage="Please enter a valid name"
              label="Name"
              name="name"
              placeholder="e.g. aeradron"
              type="text"
              variant="faded"
            />
            <Select
              isRequired
              label="Select your Industry"
              name="industry"
              variant="faded"
            >
              {INDUSTRIES.map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
          </div>
          <Textarea
            isRequired
            aria-label="Description"
            className="col-span-12 md:col-span-6 mb-6 md:mb-0 whitespace-pre"
            errorMessage="Please enter valid description"
            maxRows={100}
            name="description"
            placeholder="Tell in brief about the forum"
            variant="faded"
          />
        </Form>
      </div>
      <p className="text-default-400 text-tiny pb-5 pl-1">
        By creating your revit forum you agree to our{" "}
        <a className="text-primary-300" href="/terms">
          terms & conditions
        </a>
      </p>
      <Button
        fullWidth
        color="primary"
        form="addForumForm"
        isDisabled={pageState.disabled}
        isLoading={pageState.loading}
        spinnerPlacement="end"
        type="submit"
      >
        Save
      </Button>
    </div>
  );
}
