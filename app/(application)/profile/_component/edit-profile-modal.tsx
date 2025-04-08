import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {DateInput} from "@heroui/date-input";
import {CalendarDate, parseDate} from "@internationalized/date";
import { useState } from "react";

import { PageState } from "@/types";
import { initPostState } from "@/utils/utils";
import { Avatar } from "@heroui/avatar";
import FileInput from "@/components/ui/FileInput";
import { UpdateUser } from "@/types/user";
import { updateUserAction } from "../action";

export default function EditProfileModal(props: any) {
  const { isOpen, onOpenChange, user} = props;

  const [pageState, setPageState] = useState<PageState>(initPostState());

  const [file, setFile] = useState<Blob>();

  const [profileImage, setProfileImage] = useState<string>(user.profileImage);
  const [name, setName] = useState<string>(user.name);
  const [dob, setDob] = useState<string>(user.dob);
  const [bio, setBio] = useState<string>(user.bio);

  const onProfileImageChange = (e: any) => {
    e.preventDefault();

    setFile(e.target.files[0]);
  };

  const onDobChange = (value: CalendarDate | null) => {
    if(value){
      console.log("dob", value.toString())
      setDob(value.toString())
    }
  }

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
      profileImage: profileImage
    }

    const res = await updateUserAction(updateUser, file);

    console.log(res);

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
              className="w-36 h-36 rounded-full"
              accept="image/*"
              handleFileUpload={onProfileImageChange}
              icon={<Avatar
                className="w-36 h-36"
                src={file ? URL.createObjectURL(file) : profileImage}
              />}
            />
        <Input
            errorMessage="Please enter a valid name"
            label="Name"
            name="name"
            variant="bordered"
            type="text"
            value={name}
            onValueChange={setName}
          />
          <DateInput
        defaultValue={parseDate("2024-04-04")}
        label="Date of Birth"
        variant="bordered"
        value={dob ? new CalendarDate(new Date(dob).getFullYear(), new Date(dob).getMonth(), new Date(dob).getDate()) : new CalendarDate(1995, 11, 6)}
        placeholderValue={new CalendarDate(1995, 11, 6)}
        onChange={onDobChange}
      />
          <Textarea
            aria-label="Bio"
            className="col-span-4 md:col-span-4 mb-6 md:mb-0"
            maxRows={2}
            label="Bio"
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