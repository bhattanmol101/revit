import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { DateInput } from "@heroui/date-input";
import { CalendarDate, parseDate } from "@internationalized/date";
import { useState } from "react";
import { Avatar } from "@heroui/avatar";

import { updateUserAction } from "../action";

import { PageState } from "@/types";
import { initPostState } from "@/utils/utils";
import FileInput from "@/components/ui/FileInput";
import { UpdateUser } from "@/types/user";

export default function EditProfileModal(props: any) {
  const { isOpen, onOpenChange, user } = props;

  const [pageState, setPageState] = useState<PageState>(initPostState());

  const [file, setFile] = useState<Blob>();

  const [name, setName] = useState<string>(user.name);
  const [dob, setDob] = useState<Date>(user.dob);
  const [bio, setBio] = useState<string>(user.bio);

  const onProfileImageChange = (e: any) => {
    e.preventDefault();

    setFile(e.target.files[0]);
  };

  const onDobChange = (value: CalendarDate | null) => {
    if (value) {
      setDob(new Date(value.toString()));
    }
  };

  const onModalOpenChange = () => {
    if (!pageState.disabled) {
      onOpenChange();
    }
  };

  const onSubmit = async () => {
    setPageState((prevState) => ({
      ...prevState,
      disabled: true,
      loading: true,
    }));

    const updateUser: UpdateUser = {
      name: name,
      dob: dob,
      bio: bio,
      profileImage: user.profileImage,
    };

    const res = await updateUserAction(user.id, updateUser, file);

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
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onModalOpenChange}
    >
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalBody className="flex flex-col items-center">
          <FileInput
            accept="image/*"
            className="w-36 h-36 rounded-full"
            handleFileUpload={onProfileImageChange}
            icon={
              <Avatar
                showFallback
                className="w-36 h-36"
                src={file ? URL.createObjectURL(file) : user.profileImage}
              />
            }
          />
          <Input
            errorMessage="Please enter a valid name"
            label="Name"
            name="name"
            type="text"
            value={name}
            variant="bordered"
            onValueChange={setName}
          />
          <DateInput
            defaultValue={parseDate("2024-04-04")}
            label="Date of Birth"
            placeholderValue={new CalendarDate(1995, 11, 6)}
            value={
              dob
                ? new CalendarDate(
                    dob.getFullYear(),
                    dob.getMonth() + 1,
                    dob.getDate()
                  )
                : new CalendarDate(1995, 11, 6)
            }
            variant="bordered"
            onChange={onDobChange}
          />
          <Textarea
            aria-label="Bio"
            className="col-span-4 md:col-span-4 mb-6 md:mb-0"
            label="Bio"
            maxRows={2}
            value={bio ? bio : ""}
            variant="bordered"
            onValueChange={setBio}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            isDisabled={pageState.disabled}
            isLoading={pageState.loading}
            spinnerPlacement="end"
            onPress={onSubmit}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
